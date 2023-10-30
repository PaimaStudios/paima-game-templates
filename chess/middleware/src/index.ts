import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  userWalletLoginWithoutChecks,
  updateBackendUri,
  getRemoteBackendVersion,
} from '@paima/sdk/mw-core';
import { WalletMode } from '@paima/providers'; // TODO: remove from middleware once we fix nodenext builds
import { gameBackendVersion, GAME_NAME } from '@chess/utils';

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
export {
  WalletMode,
  userWalletLoginWithoutChecks,
  updateBackendUri,
  getRemoteBackendVersion,
};

export default endpoints;
