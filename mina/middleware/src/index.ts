import 'o1js'; // Needed for .d.ts generator to be able to name the types of our exports (TS2742).
import { MinaDelegationCache } from '@paima/providers';
import { initMiddlewareCore, paimaEndpoints } from '@paima/sdk/mw-core';

import { GAME_NAME, gameBackendVersion } from '@game/utils';

import { queryEndpoints } from './endpoints/queries.js';
import { writeEndpoints } from './endpoints/write.js';

export * from './types.js';
export type * from './types.js';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const thing = new MinaDelegationCache({
  gameName: GAME_NAME
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

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,

  publicKey: thing.publicKey,
  signature: thing.signature,
  verificationKey: thing.verificationKey,
  proof: thing.proof,
};

export default endpoints;
