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
async function newGame(): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('joinWorld');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('g');
  conciseBuilder.addValue({ value: 'x', isStateIdentifier: true });
  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      await awaitBlock(result.blockHeight);
      const game = await queryEndpoints.getNewGame(query.result);
      if (game.success) return game;
      return errorFxn(1000);
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

//        ai = ai|target|id|response
async function ai(
  target: string,
  id: number,
  response: string
): Promise<PostDataResponse | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('joinWorld');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('ai');
  conciseBuilder.addValue({ value: String(target) });
  conciseBuilder.addValue({ value: String(id) });
  conciseBuilder.addValue({ value: String(response) });
  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      await awaitBlock(result.blockHeight);
      return result;
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

export const writeEndpoints = {
  newGame,
  ai,
};
