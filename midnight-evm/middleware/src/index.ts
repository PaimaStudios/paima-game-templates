import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  userWalletLoginWithoutChecks,
  updateBackendUri,
  getRemoteBackendVersion,
} from '@paima/sdk/mw-core';
import { gameBackendVersion, GAME_NAME } from '@midnightevm/utils';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export { userWalletLoginWithoutChecks, updateBackendUri, getRemoteBackendVersion };

export default endpoints;
