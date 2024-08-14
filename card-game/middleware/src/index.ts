import { paimaEndpoints } from '@paima/sdk/mw-core';
import { initMiddlewareCore } from '@paima/sdk/mw-core';

export { PaimaEventManager } from '@paima/sdk/events';

import { gameBackendVersion, GAME_NAME } from '@game/utils';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export * from './types';
export type * from './types';

export default endpoints;
