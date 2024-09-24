import type { Result } from '@paima/sdk/utils';
import type { EndpointErrorFxn } from '@paima/sdk/mw-core';
import { getDefaultActiveAddress, PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

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

export const writeEndpoints = {};
