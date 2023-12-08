import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  userWalletLoginWithoutChecks,
  updateBackendUri,
  getRemoteBackendVersion,
} from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@hexbattle/utils';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';
import { ENV } from '@paima/sdk/utils';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export {
  userWalletLoginWithoutChecks,
  updateBackendUri,
  getRemoteBackendVersion,
  ENV,
};

export default endpoints;
