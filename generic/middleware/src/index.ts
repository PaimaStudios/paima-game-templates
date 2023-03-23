import { paimaEndpoints } from 'paima-sdk/paima-mw-core';
import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

import { initMiddlewareCore } from 'paima-sdk/paima-mw-core';

import { gameBackendVersion, GAME_NAME } from '@game/utils';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export * from './types';

export default endpoints;
