import type { ErrorCode, ErrorMessageFxn } from 'paima-sdk/paima-utils';
import type { FailedResult } from 'paima-sdk/paima-mw-core';
import { PaimaMiddlewareErrorCode } from 'paima-sdk/paima-mw-core';
export type EndpointErrorFxn = (errorDescription: ErrorCode | string, err?: any) => FailedResult;
export { PaimaMiddlewareErrorCode };
export declare const enum ChessMiddlewareErrorCode {
    GENERIC_CHESS_ERROR = 29,
    CALCULATED_ROUND_END_IN_PAST = 30,
    UNABLE_TO_BUILD_EXECUTOR = 31,
    NO_OPEN_LOBBIES = 32,
    RANDOM_OPEN_LOBBY_FALLBACK = 33,
    FAILURE_VERIFYING_LOBBY_CREATION = 34,
    FAILURE_VERIFYING_LOBBY_CLOSE = 35,
    FAILURE_VERIFYING_LOBBY_JOIN = 36,
    CANNOT_JOIN_OWN_LOBBY = 37,
    CANNOT_CLOSE_SOMEONES_LOBBY = 38,
    SUBMIT_MOVES_EXACTLY_3 = 39,
    SUBMIT_MOVES_INVALID_MOVES = 40,
    INTERNAL_INVALID_DEPLOYMENT = 41,
    INTERNAL_INVALID_POSTING_MODE = 42
}
export declare const chessErrorMessageFxn: ErrorMessageFxn;
export declare function buildEndpointErrorFxn(endpointName: string): EndpointErrorFxn;
