import { paimaEndpoints, WalletConnectHelper } from '@paima/sdk/mw-core';
import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

import { initMiddlewareCore } from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@game/utils';
import { DelegationOrder, DelegationOrderProgram, Secp256k1 } from '@game/mina-contracts';
import { AddressType } from '@paima/sdk/utils';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

import { EvmInjectedConnector } from '@paima/providers';
import { Cache, CacheHeader, PrivateKey, PublicKey } from 'o1js';

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
    await DelegationOrderProgram.compile({ cache });
    console.timeEnd('DelegationOrderProgram.compile');
  },

  async sign() {
    const provider = await EvmInjectedConnector.instance().connectSimple({ gameName: GAME_NAME, gameChainId: undefined });
    const signature = await provider.signMessage(DelegationOrder.bytesToSign(temporaryPrivateKey.toPublicKey()));
    console.log('signature', signature);
  },
};

export * from './types';
export type * from './types';

export default endpoints;
