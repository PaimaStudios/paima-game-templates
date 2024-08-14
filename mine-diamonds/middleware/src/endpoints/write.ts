import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, OldResult, Result } from '@paima/sdk/mw-core';
import {
  PaimaMiddlewareErrorCode,
  postConciselyEncodedData,
  getDefaultActiveAddress,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';

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

async function submitMineAttempt(): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitMineAttempt');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('m'); // m|

  try {
    const result = await postConciselyEncodedData(conciseBuilder.build());
    if (result.success) {
      return { success: true, message: '' };
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

export const writeEndpoints = {
  submitMineAttempt,
};
