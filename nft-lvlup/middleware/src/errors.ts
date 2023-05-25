import type { ErrorMessageFxn } from 'paima-sdk/paima-utils';
import { buildErrorCodeTranslator } from 'paima-sdk/paima-utils';
import type { EndpointErrorFxn } from 'paima-sdk/paima-mw-core';
import {
  PaimaMiddlewareErrorCode,
  PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  buildAbstractEndpointErrorFxn,
} from 'paima-sdk/paima-mw-core';

export const enum MiddlewareErrorCode {
  GENERIC_ERROR = PaimaMiddlewareErrorCode.FINAL_PAIMA_GENERIC_ERROR + 1,
  // Write endpoint related:
  FAILURE_VERIFYING_NFT_OWNERSHIP,
  // Internal, should never occur:
  INTERNAL_INVALID_POSTING_MODE,
}

type ErrorMessageMapping = Record<MiddlewareErrorCode, string>;
const MIDDLEWARE_ERROR_MESSAGES: ErrorMessageMapping = {
  [MiddlewareErrorCode.GENERIC_ERROR]: 'Unspecified generic Game error',
  [MiddlewareErrorCode.FAILURE_VERIFYING_NFT_OWNERSHIP]: 'Failure while verifying lobby creation',
  [MiddlewareErrorCode.INTERNAL_INVALID_POSTING_MODE]: 'Internal error: Invalid posting mode set',
};

const errorMessageFxn: ErrorMessageFxn = buildErrorCodeTranslator({
  ...PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  ...MIDDLEWARE_ERROR_MESSAGES,
});

export function buildEndpointErrorFxn(endpointName: string): EndpointErrorFxn {
  return buildAbstractEndpointErrorFxn(errorMessageFxn, endpointName);
}
