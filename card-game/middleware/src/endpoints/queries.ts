import { PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import { gameRestClient } from '../client';
import type { Result } from '@paima/sdk/utils';
import type { components } from '../rest-schema';

async function getGame(): Promise<Result<components['schemas']['IGetCardsResult'][]>> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  try {
    const { data, error } = await gameRestClient.GET('/game', {
      params: { query: undefined },
    });
    if (error != null) {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, error);
    }
    return {
      success: true,
      result: data.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }
}

export const queryEndpoints = {
  getGame,
};
