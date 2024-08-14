import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn } from '@paima/sdk/mw-core';
import {
  PaimaMiddlewareErrorCode,
  postConciseData,
  getDefaultActiveAddress,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import { awaitBlockWS } from '@paima/sdk/events';
import type { FailedResult, Result, SuccessfulResult } from '@paima/sdk/utils';

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

async function click(card: number): Promise<SuccessfulResult<{ block: number }> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('joinWorld');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('click');
  conciseBuilder.addValue({ value: String(card), isStateIdentifier: true });
  try {
    const result = await postConciseData(conciseBuilder.build(), errorFxn);
    if (result.success) {
      await awaitBlockWS(result.blockHeight);
      return { success: true, result: { block: result.blockHeight } };
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
