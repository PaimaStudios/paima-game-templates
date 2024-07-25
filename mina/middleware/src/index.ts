import { extractPublicKey } from '@metamask/eth-sig-util';
import { delegateEvmToMina } from '@paima/mina-delegation';
import { EvmInjectedConnector } from '@paima/providers';
import { initMiddlewareCore, paimaEndpoints } from '@paima/sdk/mw-core';
import {
  Cache,
  CacheHeader,
  DynamicProof,
  JsonProof,
  PrivateKey,
  PublicKey,
  VerificationKey,
} from 'o1js';

import { GAME_NAME, gameBackendVersion } from '@game/utils';

import { queryEndpoints } from './endpoints/queries.js';
import { writeEndpoints } from './endpoints/write.js';

import type { Methods } from './worker.js';

export * from './types.js';
export type * from './types.js';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

function getWorkerURL(relative: string): string {
  const absolute = new URL(relative, import.meta.url);
  const text = `self.window = self; import(${JSON.stringify(absolute)});`;
  return URL.createObjectURL(new Blob([text], { type: 'text/javascript' }));
}

class WorkerClient {
  private worker = new Worker(getWorkerURL('./worker.js'), { type: 'module' });
  private next = 1;
  private pending = new Map<number, PromiseWithResolvers<unknown>>();
  private ready: Promise<unknown>;

  constructor() {
    // Needed otherwise async import() of the real script will result in
    // onmessage event handler being added too late and our call being dropped.
    const readyEvent = Promise.withResolvers();
    this.pending.set(0, readyEvent);
    this.ready = readyEvent.promise;

    this.worker.addEventListener('error', console.error);
    this.worker.addEventListener('messageerror', console.error);
    this.worker.addEventListener('message', event => {
      this.pending.get(event.data.id)?.resolve(event.data.result);
      this.pending.delete(event.data.id);
    });
  }

  method<M extends keyof Methods>(method: M): Methods[M] {
    return (async (...args: unknown[]) => {
      await this.ready;

      const replyEvent = Promise.withResolvers();
      const id = this.next++;
      this.pending.set(id, replyEvent);
      this.worker.postMessage({ id, method, args });
      return await replyEvent.promise;
    }) as Methods[M];
  }
}

interface TheThingStorage {
  privateKey?: string;
  signature?: string;
  verificationKey?: {
    data: string;
    hash: string;
  };
  proof?: JsonProof;
}

class TheThing {
  /** The randomly-generated Mina private key, for use. */
  privateKey: PrivateKey;
  /** The corresponding public key, which gets signed. */
  publicKey: PublicKey;
  /** The signed order. May be rejected by user cancelling. */
  signature: Promise<string>;
  /** The verification key which can be used by {@link DynamicProof}. */
  verificationKey: Promise<VerificationKey>;
  /** The serialized ZK proof of the signature. */
  proof: Promise<JsonProof>;

  private worker = new WorkerClient();

  constructor({
    prefix,
    onRejectSignature,
  }: {
    /** The proof namespace, like "My Game login: ". Shown in the signature prompt and used as the storage key. */
    prefix: string;
    /** If provided, called when the user declines to sign. */
    onRejectSignature?: (err: unknown, askAgain: () => void) => void;
  }) {
    // Just reuse the prefix as the storage key.
    const storageKey = prefix;
    const storage: TheThingStorage = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    const { DelegationOrder } = delegateEvmToMina(prefix);

    // 1. key
    if (storage.privateKey) {
      this.privateKey = PrivateKey.fromBase58(storage.privateKey);
    } else {
      this.privateKey = PrivateKey.random();
      storage.privateKey = this.privateKey.toBase58();
      localStorage.setItem(storageKey, JSON.stringify(storage));
    }
    const target = (this.publicKey = this.privateKey.toPublicKey());

    // 2. signature
    const signaturePromise = (this.signature = (async () => {
      if (!storage.signature) {
        const provider = await EvmInjectedConnector.instance().connectSimple({
          gameName: GAME_NAME,
          gameChainId: undefined,
        });
        const data = DelegationOrder.bytesToSign({ target });
        const stringData = new TextDecoder().decode(data);
        if (onRejectSignature) {
          while (true) {
            try {
              storage.signature = await provider.signMessage(stringData);
              break;
            } catch (err) {
              const { promise, resolve } = Promise.withResolvers<void>();
              onRejectSignature(err, resolve);
              await promise;
            }
          }
        } else {
          storage.signature = await provider.signMessage(stringData);
        }
        localStorage.setItem(storageKey, JSON.stringify(storage));
      }
      return storage.signature;
    })());

    // 3. verification key
    const vkPromise = (this.verificationKey = (async () => {
      // If the VK isn't in local storage, start compiling concurrently
      // with waiting for the signature. Also do this if !storage.proof because
      // we need to call .compile() before proving.
      if (!storage.verificationKey || !storage.proof) {
        storage.verificationKey = JSON.parse(await this.worker.method('compile')());
        localStorage.setItem(storageKey, JSON.stringify(storage));
      }
      // NB: fromJSON's signature accepts `string` but it actually wants an object,
      // so do a horrifying cast.
      return VerificationKey.fromJSON(storage.verificationKey as unknown as string /* wtf? */);
    })());

    // 3. proof
    this.proof = (async () => {
      if (!storage.proof) {
        // Wait on dependencies.
        await vkPromise;
        const signature = await signaturePromise;

        // Turn the signature into a DelegationOrder and sign it.
        const data = DelegationOrder.bytesToSign({ target });
        const ethPublicKey = extractPublicKey({ data, signature });
        const proof = await this.worker.method('sign')({
          target: target.toBase58(),
          signer: ethPublicKey,
          signature: signature,
        });

        // Save it back.
        storage.proof = proof;
        localStorage.setItem(storageKey, JSON.stringify(storage));
      }
      return storage.proof;
    })();
  }
}

const thing = new TheThing({
  prefix: `${GAME_NAME} login: `,
});
console.log('publicKey =', thing.publicKey.toBase58());
(async () => {
  console.log('signature =', await thing.signature);
})();
(async () => {
  const vk = await thing.verificationKey;
  console.log('vk =', vk.data.length, ':', vk);
})();
(async () => {
  const p = await thing.proof;
  console.log('proof =', JSON.stringify(p).length, ':', p);
})();

let opfsCacheInstance: Promise<Cache> | undefined;

/** o1js cache that saves to zkcache/ in the origin-private file system. */
export function opfsCache(): Promise<Cache> {
  return (opfsCacheInstance ??= OpfsCache.load());
}

class OpfsCache implements Cache {
  readonly canWrite: true = true;
  debug?: boolean | undefined;

  private readonly files: Map<string, Uint8Array>;
  private readonly dir: FileSystemDirectoryHandle;

  static async load() {
    const files = new Map<string, Uint8Array>();
    const root = await navigator.storage.getDirectory();
    const dir = await root.getDirectoryHandle('zkcache', { create: true });
    for await (const [k, v] of dir.entries()) {
      if (v instanceof FileSystemFileHandle) {
        files.set(k, new Uint8Array(await (await v.getFile()).arrayBuffer()));
      }
    }
    return new OpfsCache({ files, dir });
  }

  constructor(params: { files: Map<string, Uint8Array>; dir: FileSystemDirectoryHandle }) {
    this.files = params.files;
    this.dir = params.dir;
  }

  read(header: CacheHeader): Uint8Array | undefined {
    if (this.debug) {
      console.log('OpfsCache', 'read', header.persistentId, this.files.has(header.persistentId));
    }
    return this.files.get(header.persistentId);
  }

  write(header: CacheHeader, value: Uint8Array): void {
    this.files.set(header.persistentId, value);
    (async () => {
      const file = await this.dir.getFileHandle(header.persistentId, { create: true });
      const writeable = await file.createWritable();
      await writeable.write(value);
      await writeable.close();
      if (this.debug) {
        console.log('OpfsCache', 'write', header.persistentId, 'len:', value.length);
      }
    })();
  }
}

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export default endpoints;
