import type { ErrorCode, ErrorMessageFxn } from 'paima-sdk/paima-utils';
import { buildErrorCodeTranslator } from 'paima-sdk/paima-utils';
import type { FailedResult } from 'paima-sdk/paima-mw-core';
import {
  PaimaMiddlewareErrorCode,
  PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  buildAbstractEndpointErrorFxn,
} from 'paima-sdk/paima-mw-core';

export type EndpointErrorFxn = (errorDescription: ErrorCode | string, err?: any) => FailedResult;

type ChessErrorMessageMapping = Record<ChessMiddlewareErrorCode, string>;

export { PaimaMiddlewareErrorCode };
export const enum ChessMiddlewareErrorCode {
  GENERIC_CHESS_ERROR = PaimaMiddlewareErrorCode.FINAL_PAIMA_GENERIC_ERROR + 1,
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

const CHESS_MIDDLEWARE_ERROR_MESSAGES: ChessErrorMessageMapping = {
  [ChessMiddlewareErrorCode.CALCULATED_ROUND_END_IN_PAST]: 'Calculated round end is in the past',
  [ChessMiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR]:
    'Unable to build executor from data returned from server -- executor might not exist',
  [ChessMiddlewareErrorCode.NO_OPEN_LOBBIES]: 'No open lobbies were found, please try again later',
  [ChessMiddlewareErrorCode.RANDOM_OPEN_LOBBY_FALLBACK]:
    'getRandomOpenLobby returned no lobby, falling back on getOpenLobbies',
  [ChessMiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION]:
    'Failure while verifying lobby creation',
  [ChessMiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE]: 'Failure while verifying lobby closing',
  [ChessMiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN]: 'Failure while verifying lobby join',
  [ChessMiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY]: 'Cannot join your own lobby',
  [ChessMiddlewareErrorCode.CANNOT_CLOSE_SOMEONES_LOBBY]:
    'Cannot close lobby created by someone else',
  [ChessMiddlewareErrorCode.SUBMIT_MOVES_EXACTLY_3]: 'Exactly three moves must be submitted',
  [ChessMiddlewareErrorCode.SUBMIT_MOVES_INVALID_MOVES]: 'One or more invalid moves submitted',
  [ChessMiddlewareErrorCode.INTERNAL_INVALID_DEPLOYMENT]: 'Internal error: Invalid deployment set',
  [ChessMiddlewareErrorCode.INTERNAL_INVALID_POSTING_MODE]:
    'Internal error: Invalid posting mode set',
};

export const chessErrorMessageFxn: ErrorMessageFxn = buildErrorCodeTranslator({
  ...PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  ...CHESS_MIDDLEWARE_ERROR_MESSAGES,
});

export function buildEndpointErrorFxn(endpointName: string): EndpointErrorFxn {
  return buildAbstractEndpointErrorFxn(chessErrorMessageFxn, endpointName);
}
