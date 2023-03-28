import type { ErrorCode, ErrorMessageFxn } from 'paima-sdk/paima-utils';
import { buildErrorCodeTranslator } from 'paima-sdk/paima-utils';
import type { FailedResult } from 'paima-sdk/paima-mw-core';
import {
  PaimaMiddlewareErrorCode,
  PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  buildAbstractEndpointErrorFxn,
} from 'paima-sdk/paima-mw-core';

export type EndpointErrorFxn = (errorDescription: ErrorCode | string, err?: any) => FailedResult;

type OpenWorldErrorMessageMapping = Record<OpenWorldMiddlewareErrorCode, string>;

export { PaimaMiddlewareErrorCode };
export const enum OpenWorldMiddlewareErrorCode {
  GENERIC_OPENWORLD_ERROR = PaimaMiddlewareErrorCode.FINAL_PAIMA_GENERIC_ERROR + 1,
  // Query endpoint related:
  CALCULATED_ROUND_END_IN_PAST,
  UNABLE_TO_BUILD_EXECUTOR,
  NO_OPEN_LOBBIES,
  RANDOM_OPEN_LOBBY_FALLBACK,
  // Write endpoint related:
  FAILURE_VERIFYING_LOBBY_CREATION,
  FAILURE_VERIFYING_LOBBY_CLOSE,
  FAILURE_VERIFYING_LOBBY_JOIN,
  CANNOT_JOIN_OWN_LOBBY,
  CANNOT_CLOSE_SOMEONES_LOBBY,
  SUBMIT_MOVES_EXACTLY_3,
  SUBMIT_MOVES_INVALID_MOVES,
  // Internal, should never occur:
  INTERNAL_INVALID_DEPLOYMENT,
  INTERNAL_INVALID_POSTING_MODE,
}

const OPENWORLD_MIDDLEWARE_ERROR_MESSAGES: OpenWorldErrorMessageMapping = {
  [OpenWorldMiddlewareErrorCode.CALCULATED_ROUND_END_IN_PAST]: 'Calculated round end is in the past',
  [OpenWorldMiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR]:
    'Unable to build executor from data returned from server -- executor might not exist',
  [OpenWorldMiddlewareErrorCode.NO_OPEN_LOBBIES]: 'No open lobbies were found, please try again later',
  [OpenWorldMiddlewareErrorCode.RANDOM_OPEN_LOBBY_FALLBACK]:
    'getRandomOpenLobby returned no lobby, falling back on getOpenLobbies',
  [OpenWorldMiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION]:
    'Failure while verifying lobby creation',
  [OpenWorldMiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE]: 'Failure while verifying lobby closing',
  [OpenWorldMiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN]: 'Failure while verifying lobby join',
  [OpenWorldMiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY]: 'Cannot join your own lobby',
  [OpenWorldMiddlewareErrorCode.CANNOT_CLOSE_SOMEONES_LOBBY]:
    'Cannot close lobby created by someone else',
  [OpenWorldMiddlewareErrorCode.SUBMIT_MOVES_EXACTLY_3]: 'Exactly three moves must be submitted',
  [OpenWorldMiddlewareErrorCode.SUBMIT_MOVES_INVALID_MOVES]: 'One or more invalid moves submitted',
  [OpenWorldMiddlewareErrorCode.INTERNAL_INVALID_DEPLOYMENT]: 'Internal error: Invalid deployment set',
  [OpenWorldMiddlewareErrorCode.INTERNAL_INVALID_POSTING_MODE]:
    'Internal error: Invalid posting mode set',
};

export const openworldErrorMessageFxn: ErrorMessageFxn = buildErrorCodeTranslator({
  ...PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  ...OPENWORLD_MIDDLEWARE_ERROR_MESSAGES,
});

export function buildEndpointErrorFxn(endpointName: string): EndpointErrorFxn {
  return buildAbstractEndpointErrorFxn(openworldErrorMessageFxn, endpointName);
}
