import { paimaEndpoints } from 'paima-sdk/paima-mw-core';
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
  postConciselyEncodedData,
} from 'paima-sdk/paima-mw-core';

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
  postConciselyEncodedData,
};

export default endpoints;
