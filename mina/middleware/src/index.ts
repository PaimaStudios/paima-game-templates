import { extractPublicKey } from '@metamask/eth-sig-util';
import { EvmInjectedConnector } from '@paima/providers';
import { initMiddlewareCore, paimaEndpoints } from '@paima/sdk/mw-core';
import {
  Cache,
  CacheHeader,
  DynamicProof,
  FeatureFlags,
  JsonProof,
  PrivateKey,
  PublicKey,
  VerificationKey,
  verify,
  Void,
} from 'o1js';

import { delegateEvmToMina, Ecdsa, Secp256k1 } from '@game/mina-contracts';
import { GAME_NAME, gameBackendVersion } from '@game/utils';

import { queryEndpoints } from './endpoints/queries.js';
import { writeEndpoints } from './endpoints/write.js';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const { DelegationOrder, DelegationOrderProgram, DelegationOrderProof } = delegateEvmToMina(
  `${GAME_NAME} login: `
);

function getWorkerURL(relative: string): string {
  const absolute = new URL(relative, import.meta.url);
  console.log(absolute);
  const text = `window = self; import(${JSON.stringify(absolute)});`;
  return URL.createObjectURL(new Blob([text], { type: "text/javascript" }));
}

interface TheThingStorage {
  privateKey?: string;
  signature?: string;
  verificationKey?: string;
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
  verificationKey?: Promise<VerificationKey>;
  /** The serialized ZK proof of the signature. */
  proof?: Promise<JsonProof>;

  private worker = new Worker(getWorkerURL('./worker.js'));

  constructor({
    storageKey,
    prefix,
    onRejectSignature,
  }: {
    storageKey: string;
    prefix: string;
    /** If provided, the user declining to sign. */
    onRejectSignature?: (err: unknown) => Promise<void>;
  }) {
    const storage: TheThingStorage = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    console.log(storageKey, '=', storage);
    const { DelegationOrder, DelegationOrderProgram, DelegationOrderProof } =
      delegateEvmToMina(prefix);

    // 1. key
    if (storage.privateKey) {
      this.privateKey = PrivateKey.fromBase58(storage.privateKey);
    } else {
      console.log('privateKey being generated...');
      this.privateKey = PrivateKey.random();
      storage.privateKey = this.privateKey.toBase58();
      localStorage.setItem(storageKey, JSON.stringify(storage));
    }
    const target = (this.publicKey = this.privateKey.toPublicKey());
    console.log('public key =', target);

    // 2. signature
    const signaturePromise = (this.signature = (async () => {
      if (!storage.signature) {
        console.log('signature being generated...');
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
              await onRejectSignature(err);
            }
          }
        } else {
          storage.signature = await provider.signMessage(stringData);
        }
        localStorage.setItem(storageKey, JSON.stringify(storage));
      }
      console.log('signature =', storage.signature);
      return storage.signature;
    })());

    return;

    // 3. verification key
    const vkPromise = this.verificationKey = (async () => {
      // Also do this if !storage.proof because we need to call .compile()
      // before proving.
      if (!storage.verificationKey || !storage.proof) {
        console.log('vk being generated...');
        // If the VK isn't in local storage, start compiling concurrently
        // with waiting for the signature.

        // TODO: Do this in a worker.
        console.time('DelegationOrderProgram.compile');
        const { verificationKey } = await DelegationOrderProgram.compile();
        console.timeEnd('DelegationOrderProgram.compile');

        storage.verificationKey = VerificationKey.toJSON(verificationKey);
      }
      console.log('verificationKey =', VerificationKey.fromJSON(storage.verificationKey));
      return VerificationKey.fromJSON(storage.verificationKey);
    })();

    // 3. proof
    this.proof = (async () => {
      if (!storage.proof) {
        await vkPromise;

        console.log('proof being generated...');
        // Turn the signature into a DelegationOrder and sign it.
        const signature = await signaturePromise;
        const data = DelegationOrder.bytesToSign({ target });
        const ethPublicKey = extractPublicKey({ data, signature });
        if (!isHex(ethPublicKey)) {
          throw new Error('!isHex(publicKey)');
        }
        const order = new DelegationOrder({
          target,
          signer: Secp256k1.fromHex(ethPublicKey),
        });
        console.time('DelegationOrderProgram.sign');
        const proof = await DelegationOrderProgram.sign(order, Ecdsa.fromHex(signature));
        console.timeEnd('DelegationOrderProgram.sign');

        // Save it back.
        storage.proof = proof.toJSON();
        localStorage.setItem(storageKey, JSON.stringify(storage));
      }
      console.log('proof =', JSON.stringify(storage.proof).length, ':', storage.proof);
      return storage.proof;
    })();
  }
}

function isHex(x: string): x is `0x${string}` {
  return x.startsWith('0x');
}

const thing = new TheThing({
  storageKey: `${GAME_NAME} login: `,
  prefix: `${GAME_NAME} login: `,
});
(async () => {
  console.log('X publicKey =', thing.publicKey);
})();
(async () => {
  console.log('X vk =', await thing.verificationKey);
})();
(async () => {
  console.log('X signature =', await thing.signature);
})();
(async () => {
  console.log('X proof =', await thing.proof);
})();

function openIndexedDB(name: string, version?: number) {
  return new Promise((resolve, reject) => {
    var request = indexedDB.open(name, version);
    request.onerror = e => reject(e);
    request.onsuccess = () => resolve(request.result);
  });
}

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

export * from './types.js';
export type * from './types.js';

export default endpoints;
