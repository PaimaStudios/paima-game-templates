import type { ErrorMessageFxn } from '@paima/sdk/utils';
import { buildErrorCodeTranslator } from '@paima/sdk/utils';
import type { EndpointErrorFxn } from '@paima/sdk/mw-core';
import {
  PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  buildAbstractEndpointErrorFxn,
} from '@paima/sdk/mw-core';
import { MiddlewareErrorCode } from '@cards/game-logic';

type ErrorMessageMapping = Record<MiddlewareErrorCode, string>;
const MIDDLEWARE_ERROR_MESSAGES: ErrorMessageMapping = {
  [MiddlewareErrorCode.GENERIC_ERROR]: 'Unspecified generic Game error',
  [MiddlewareErrorCode.CALCULATED_ROUND_END_IN_PAST]: 'Calculated round end is in the past',
  [MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR]:
    'Unable to build executor from data returned from server -- executor might not exist',
  [MiddlewareErrorCode.NO_OPEN_LOBBIES]: 'No open lobbies were found, please try again later',
  [MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION]: 'Failure while verifying lobby creation',
  [MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE]: 'Failure while verifying lobby closing',
  [MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN]: 'Failure while verifying lobby join',
  [MiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY]: 'Cannot join your own lobby',
  [MiddlewareErrorCode.CANNOT_CLOSE_SOMEONES_LOBBY]: 'Cannot close lobby created by someone else',
  [MiddlewareErrorCode.SUBMIT_MOVES_INVALID_MOVES]: 'One or more invalid moves submitted',
};

const errorMessageFxn: ErrorMessageFxn = buildErrorCodeTranslator({
  ...PAIMA_MIDDLEWARE_ERROR_MESSAGES,
  ...MIDDLEWARE_ERROR_MESSAGES,
});

export function buildEndpointErrorFxn(endpointName: string): EndpointErrorFxn {
  return buildAbstractEndpointErrorFxn(errorMessageFxn, endpointName);
}
