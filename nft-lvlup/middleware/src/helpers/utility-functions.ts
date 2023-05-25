import { MiddlewareErrorCode } from '../errors';
import type { EndpointErrorFxn, Result } from 'paima-sdk/paima-mw-core';
import { getActiveAddress, PaimaMiddlewareErrorCode } from 'paima-sdk/paima-mw-core';

export const getUserWallet = (errorFxn: EndpointErrorFxn): Result<string> => {
  try {
    const wallet = getActiveAddress();
    if (wallet.length === 0) {
      return errorFxn(PaimaMiddlewareErrorCode.WALLET_NOT_CONNECTED);
    }
    return { result: wallet, success: true };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.INTERNAL_INVALID_POSTING_MODE, err);
  }
};
