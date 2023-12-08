import type { EndpointErrorFxn, Result } from '@paima/sdk/mw-core';
import { getDefaultActiveAddress, PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

export const getUserWallet = (errorFxn: EndpointErrorFxn): Result<string> => {
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
