import type { FailedResult } from '@paima/sdk/mw-core';
import { buildBackendQuery, PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

import type { UserStats } from '@game/utils';

import { buildEndpointErrorFxn } from '../errors';
import type { PackedStats, PackedUserStats } from '../types';

async function getGame(): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  let res: Response;
  try {
    const query = buildBackendQuery('game/', {});
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export const queryEndpoints = {
  getGame,
};
