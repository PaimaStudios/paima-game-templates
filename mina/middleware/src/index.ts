import { paimaEndpoints } from '@paima/sdk/mw-core';
import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

import { initMiddlewareCore } from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@game/utils';
import { DelegationOrder, DelegationOrderProgram } from '@game/mina-contracts';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,

  async compile() {
    await DelegationOrderProgram.compile();
  }
};

export * from './types';
export type * from './types';

export default endpoints;
