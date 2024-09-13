import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  updateBackendUri,
  getRemoteBackendVersion,
  postConciselyEncodedData,
} from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@game/utils';

import { WalletMode } from '@paima/sdk/providers';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

import * as Types from './types';

export const Paima = {
  Types,
  updateBackendUri,
  getRemoteBackendVersion,
  postConciselyEncodedData,
  endpoints,
};
