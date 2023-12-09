import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  updateBackendUri,
  getRemoteBackendVersion,
  postConciselyEncodedData,
} from '@paima/sdk/mw-core'

import { gameBackendVersion, GAME_NAME } from '@dice/utils';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export * from './types';
export {
  updateBackendUri,
  getRemoteBackendVersion,
  postConciselyEncodedData,
};

export default endpoints;
