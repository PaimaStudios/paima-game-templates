import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, OldResult, Result } from '@paima/sdk/mw-core';
import {
  PaimaMiddlewareErrorCode,
  postConciselyEncodedData,
  getDefaultActiveAddress,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import { ENV } from '@paima/sdk/utils';

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

async function submitMoves(x: number, y: number): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('m', true); // @m||x|y
  conciseBuilder.addValue({ value: String(x) });
  conciseBuilder.addValue({ value: String(y) });

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

async function submitIncrement(x: number, y: number): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitIncrement');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  // const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('i');
  conciseBuilder.addValue({ value: String(x), isStateIdentifier: true });
  conciseBuilder.addValue({ value: String(y), isStateIdentifier: true });

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

async function joinWorld(): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('joinWorld');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('j');
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
  joinWorld,
  submitMoves,
  submitIncrement,
};
