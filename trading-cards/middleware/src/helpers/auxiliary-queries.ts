import type { EndpointErrorFxn, FailedResult, Result } from '@paima/sdk/mw-core';
import { PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import type { NewLobbies, PackedLobbyState } from '../types';
import { userCreatedLobby, userJoinedLobby } from './utility-functions';
import { backendQueryLobbyState, backendQueryUserLobbiesBlockheight } from './query-constructors';
import type {
  ApiResult,
  LobbyStateResponse,
  UserLobbiesBlockHeightResponse,
} from '@cards/game-logic';

export async function auxGet<R>(
  builtQuery: string,
  errorFxn: EndpointErrorFxn
): Promise<Result<R>> {
  let response: Response;
  try {
    response = await fetch(builtQuery);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const result = (await response.json()) as ApiResult<R>;
    if (result.success) return result;
    return errorFxn(result.errorCode);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function auxGetLobbyState(lobbyID: string): Promise<PackedLobbyState | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getRawLobbyState');

  let res: Response;
  try {
    const query = backendQueryLobbyState(lobbyID);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as ApiResult<LobbyStateResponse>;
    if (j.success) return { success: true, lobby: j.result.lobby };
    return errorFxn(j.errorCode);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getRawNewLobbies(
  nftId: number,
  blockHeight: number
): Promise<NewLobbies | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getRawNewLobbies');

  let res: Response;
  try {
    const query = backendQueryUserLobbiesBlockheight(nftId, blockHeight);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as ApiResult<UserLobbiesBlockHeightResponse>;
    if (j.success) return { success: true, lobbies: j.result.lobbies };
    return errorFxn(j.errorCode);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getNonemptyNewLobbies(
  nftId: number,
  blockHeight: number
): Promise<NewLobbies> {
  const newLobbies = await getRawNewLobbies(nftId, blockHeight);
  if (!newLobbies.success) {
    throw new Error('Failed to get new lobbies');
  } else if (newLobbies.lobbies.length === 0) {
    throw new Error('Received an empty list of new lobbies');
  } else {
    return newLobbies;
  }
}

export async function getLobbyStateWithUser(
  lobbyID: string,
  nftId: number
): Promise<PackedLobbyState> {
  const lobbyState = await auxGetLobbyState(lobbyID);
  if (!lobbyState.success) {
    throw new Error('Failed to get lobby state');
  } else if (userJoinedLobby(nftId, lobbyState) || userCreatedLobby(nftId, lobbyState)) {
    return lobbyState;
  } else {
    throw new Error('User is not in the lobby');
  }
}
