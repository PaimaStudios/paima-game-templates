import { extractPublicKey } from '@metamask/eth-sig-util';
import { EvmInjectedConnector } from '@paima/providers';
import { initMiddlewareCore, paimaEndpoints } from '@paima/sdk/mw-core';
import {
  Cache,
  CacheHeader,
  DynamicProof,
  FeatureFlags,
  FlexibleProvablePure,
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

interface TheThingStorage {
  privateKey?: string;
  signature?: string;
  proof?: JsonProof;
}

class TheThing {
  /** The randomly-generated Mina private key, for use. */
  privateKey: PrivateKey;
  /** The corresponding public key, which gets signed. */
  publicKey: PublicKey;
  /** The signed order. May be rejected by user cancelling. */
  signature: Promise<string>;
  /** The serialized ZK proof of the signature. */
  proof: Promise<JsonProof>;

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
    console.log('private key =', target);

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

    // 3. proof
    this.proof = (async () => {
      if (!storage.proof) {
        console.log('proof being generated...');
        // If the proof isn't in local storage, start compiling concurrently
        // with waiting for the signature.
        // TODO: Store verification key.
        // TODO: Do this in a worker.
        console.time('DelegationOrderProgram.compile');
        await DelegationOrderProgram.compile();
        console.timeEnd('DelegationOrderProgram.compile');

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

const thing = new TheThing({
  storageKey: `${GAME_NAME} login: `,
  prefix: `${GAME_NAME} login: `,
});

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

function isHex(x: string): x is `0x${string}` {
  return x.startsWith('0x');
}

let vk: VerificationKey;

class SideloadedProgramProof extends DynamicProof<typeof DelegationOrder, void> {
  static publicInputType = DelegationOrder;
  static publicOutputType = Void;
  static maxProofsVerified = 0 as const;
}

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,

  async compile() {
    //const cache = await opfsCache();
    console.time('DelegationOrderProgram.compile');
    const { verificationKey } = await DelegationOrderProgram.compile(/*{ cache }*/);
    console.timeEnd('DelegationOrderProgram.compile');
    vk = verificationKey;
    return JSON.stringify(verificationKey).length;
  },

  async sign() {
    const provider = await EvmInjectedConnector.instance().connectSimple({
      gameName: GAME_NAME,
      gameChainId: undefined,
    });
    const target = temporaryPrivateKey.toPublicKey();
    const data = DelegationOrder.bytesToSign({ target });
    const stringData = new TextDecoder().decode(data);
    const signature = await provider.signMessage(stringData);
    const publicKey = extractPublicKey({ data, signature });
    if (!isHex(publicKey)) throw new Error('!isHex(publicKey)');
    console.log('signature', signature);
    console.log('publicKey', publicKey);
    const signature2 = Ecdsa.fromHex(signature);
    console.log('Ecdsa.fromHex', signature2);

    // Stringify and destringify later because otherwise the main thread's
    // Field class != the worker thread's Field class, and instanceof fails.
    return { signature, target: target.toBase58(), signer: publicKey };
  },

  async prove(args: { signature: string; target: string; signer: `0x${string}` }) {
    const order = new DelegationOrder({
      target: PublicKey.fromBase58(args.target),
      signer: Secp256k1.fromHex(args.signer),
    });

    const signature = Ecdsa.fromHex(args.signature);
    const proof: DelegationOrderProof = await DelegationOrderProgram.sign(order, signature);
    console.log('proof', proof);
    console.log('proof.toJSON()', proof.toJSON());
    return proof.toJSON();
  },

  async verify(jsonProof: JsonProof) {
    console.log('flags', await FeatureFlags.fromZkProgram(DelegationOrderProgram));
    DynamicProof.featureFlags = FeatureFlags.allMaybe;
    const delegProof = await DelegationOrderProof.fromJSON(jsonProof);
    console.log('delegProof', delegProof);
    const staticVerify = await DelegationOrderProgram.verify(delegProof);
    console.log('static', staticVerify);
    const dynProof = await SideloadedProgramProof.fromJSON(jsonProof);
    console.log('dynProof', dynProof);
    const dynamicVerify = await verify(dynProof, vk);
    console.log('dynamic', dynamicVerify);
    return staticVerify /*&& dynamicVerify*/;
  },
};

export * from './types.js';
export type * from './types.js';

export default endpoints;
