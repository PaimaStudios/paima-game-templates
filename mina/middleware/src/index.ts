import { extractPublicKey } from '@metamask/eth-sig-util';
import { EvmInjectedConnector } from '@paima/providers';
import { initMiddlewareCore, paimaEndpoints } from '@paima/sdk/mw-core';
import { Cache, CacheHeader, PrivateKey } from 'o1js';

import { DelegationOrder, DelegationOrderProgram, Ecdsa, PublicKey, Secp256k1 } from '@game/mina-contracts';
import { GAME_NAME, gameBackendVersion } from '@game/utils';

import { queryEndpoints } from './endpoints/queries.js';
import { writeEndpoints } from './endpoints/write.js';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const temporaryPrivateKey = PrivateKey.random();

function openDb(name: string, version?: number) {
  return new Promise((resolve, reject) => {
    var request = indexedDB.open(name, version);
    request.onerror = e => reject(e);
    request.onsuccess = e => resolve(request.result);
  });
}

class IndexedDbCache implements Cache {
  canWrite: boolean = true;
  debug?: boolean | undefined;

  files = new Map<string, Uint8Array>();
  dir?: FileSystemDirectoryHandle;

  async load() {
    const root = await navigator.storage.getDirectory();
    this.dir = await root.getDirectoryHandle('zkcache', { create: true });
    for await (const [k, v] of this.dir.entries()) {
      if (v instanceof FileSystemFileHandle) {
        console.log('load', k);
        this.files.set(k, new Uint8Array(await (await v.getFile()).arrayBuffer()));
      }
    }
  }

  read(header: CacheHeader): Uint8Array | undefined {
    console.log('read', header.persistentId, this.files.has(header.persistentId));
    return this.files.get(header.persistentId);
  }
  write(header: CacheHeader, value: Uint8Array): void {
    this.files.set(header.persistentId, value);
    (async () => {
      const file = await this.dir!.getFileHandle(header.persistentId, { create: true });
      //if (!file) throw new Error('!file');
      const writeable = await file.createWritable();
      //if (!writeable) throw new Error('!writeable');
      await writeable.write(value);
      await writeable.close();
      console.log('write', header.persistentId, 'ok');
    })();
  }
}
const cache = new IndexedDbCache();

function isHex(x: string): x is `0x${string}` {
  return x.startsWith('0x');
}

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,

  async compile() {
    if (cache.files.size == 0) {
      console.time('cache.load');
      await cache.load();
      console.timeEnd('cache.load');
    }
    console.time('DelegationOrderProgram.compile');
    await DelegationOrderProgram.compile(/*{ cache }*/);
    console.timeEnd('DelegationOrderProgram.compile');
  },

  async sign() {
    const provider = await EvmInjectedConnector.instance().connectSimple({ gameName: GAME_NAME, gameChainId: undefined });
    const target = temporaryPrivateKey.toPublicKey();
    const data = DelegationOrder.bytesToSign(target);
    const signature = await provider.signMessage(data);
    const publicKey = extractPublicKey({ data, signature });
    if (!isHex(publicKey))
      throw new Error('!isHex(publicKey)');
    console.log('signature', signature);
    console.log('publicKey', publicKey);
    const signature2 = Ecdsa.fromHex(signature);
    console.log('Ecdsa.fromHex', signature2);

    // Stringify and destringify later because otherwise the main thread's
    // Field class != the worker thread's Field class, and instanceof fails.
    return { signature, target: target.toBase58(), signer: publicKey };
  },

  async prove(args: { signature: string, target: string, signer: `0x${string}` }) {
    const order = new DelegationOrder({
      target: PublicKey.fromBase58(args.target),
      signer: Secp256k1.fromHex(args.signer),
    });

    const signature = Ecdsa.fromHex(args.signature);
    const proof = await DelegationOrderProgram.sign(order, signature);
    console.log('proof', proof);
    console.log('proof.toJSON()', proof.toJSON());
  },
};

export * from './types.js';
export type * from './types.js';

export default endpoints;
