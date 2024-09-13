import type { QueryOptions } from '@paima/sdk/mw-core';
import { buildQuery, getBackendUri, PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';
import { buildEndpointErrorFxn } from '../errors';
import type { PackedStats } from '../types';
import type { FailedResult } from '@paima/sdk/utils';

function buildBackendQuery(endpoint: string, options: QueryOptions) {
  return `${getBackendUri()}/${buildQuery(endpoint, options)}`;
}

async function getLocations(): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  let res: Response;
  try {
    const query = buildBackendQuery('locations', {});
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
  getLocations,
};
