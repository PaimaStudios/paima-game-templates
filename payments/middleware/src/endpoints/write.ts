import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, PostDataResponse, Result } from '@paima/sdk/mw-core';
import {
  PaimaMiddlewareErrorCode,
  postConciseData,
  getDefaultActiveAddress,
  awaitBlock,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import { queryEndpoints } from './queries';
import type { PackedStats } from '../types';

const getUserWallet = (errorFxn: EndpointErrorFxn): Result<string> => {
  try {
    const wallet = getDefaultActiveAddress();
    if (wallet.length === 0) {
      return errorFxn(PaimaMiddlewareErrorCode.WALLET_NOT_CONNECTED);
    }
    return { result: wallet, success: true };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INTERNAL_INVALID_POSTING_MODE, err);
  }
};

//        newGame = g|*x
async function newLocation(
  title: string,
  description: string,
  lat: number,
  lon: number
): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('joinWorld');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  // createLocation = @c|lat|lon|title|description
  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('c', true);
  conciseBuilder.addValue({ value: String(lat) });
  conciseBuilder.addValue({ value: String(lon) });
  conciseBuilder.addValue({ value: String(title) });
  conciseBuilder.addValue({ value: String(description) });

  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      await awaitBlock(result.blockHeight);
      const game = await queryEndpoints.getLocations();
      if (game.success) return game;
      return errorFxn(1000);
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

export const writeEndpoints = {
  newLocation,
};
