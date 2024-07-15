import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, PostDataResponse, Result } from '@paima/sdk/mw-core';
import {
  PaimaMiddlewareErrorCode,
  postConciseData,
  getDefaultActiveAddress,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import type { PackedStats } from '../types';
import { awaitBlock } from '@paima/sdk/events';

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

async function click(card: number): Promise<PackedStats<{ block: number }> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('joinWorld');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('click');
  conciseBuilder.addValue({ value: String(card), isStateIdentifier: true });
  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      await awaitBlock({ blockHeight: result.blockHeight });
      return { success: true, stats: { block: result.blockHeight } } 
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

export const writeEndpoints = {
  click,
};
