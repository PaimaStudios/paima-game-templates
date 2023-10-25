import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  cardanoWalletLoginEndpoint,
  switchToBatchedCardanoMode,
  switchToBatchedEthMode,
  switchToBatchedPolkadotMode,
  switchToUnbatchedMode,
  switchToAutomaticMode,
  userWalletLoginWithoutChecks,
  updateBackendUri,
  getRemoteBackendVersion,
} from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@hexbattle/utils';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';
import prando from '@paima/sdk/prando';
import { ENV } from '@paima/sdk/utils';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

export {
  userWalletLoginWithoutChecks,
  cardanoWalletLoginEndpoint,
  switchToUnbatchedMode,
  switchToBatchedEthMode,
  switchToBatchedCardanoMode,
  switchToBatchedPolkadotMode,
  switchToAutomaticMode,
  updateBackendUri,
  getRemoteBackendVersion,
  prando,
  ENV,
};

export default endpoints;
