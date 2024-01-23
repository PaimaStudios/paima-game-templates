import { retryPromise } from '@paima/sdk/utils';
import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, OldResult, Result } from '@paima/sdk/mw-core';
import {
  awaitBlock,
  getDefaultActiveAddress,
  PaimaMiddlewareErrorCode,
  postConciseData,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn, MiddlewareErrorCode } from '../errors';
import { getLobbyStateWithUser, getNonemptyNewLobbies } from '../helpers/auxiliary-queries';
import { lobbyWasClosed, userCreatedLobby, userJoinedLobby } from '../helpers/utility-functions';
import type { MatchMove } from '@chess/game-logic';
import type { CreateLobbySuccessfulResponse, PackedLobbyState } from '../types';

const RETRY_PERIOD = 1000;
const RETRIES_COUNT = 8;

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

async function createLobby(
  numberOfRounds: number,
  roundLength: number,
  playTimePerPlayer: number,
  botDifficulty: number,
  isHidden = false,
  isPractice = false,
  playerOneIsWhite = true
): Promise<CreateLobbySuccessfulResponse | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('createLobby');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('c');
  conciseBuilder.addValues([
    { value: numberOfRounds.toString(10) },
    { value: roundLength.toString(10) },
    { value: playTimePerPlayer.toString(10) },
    { value: isHidden ? 'T' : 'F' },
    { value: isPractice ? 'T' : 'F' },
    { value: botDifficulty.toString(10) },
    { value: playerOneIsWhite ? 'T' : 'F' },
  ]);

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;
  console.log(response);

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    const newLobbies = await retryPromise(
      () => getNonemptyNewLobbies(userWalletAddress, currentBlock),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (
      !newLobbies.hasOwnProperty('lobbies') ||
      !Array.isArray(newLobbies.lobbies) ||
      newLobbies.lobbies.length === 0
    ) {
      return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION);
    }
    return {
      success: true,
      lobbyID: newLobbies.lobbies[0].lobby_id,
      lobbyStatus: 'open',
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION, err);
  }
}

async function joinLobby(lobbyID: string): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('joinLobby');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('j');
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    const lobbyState = await retryPromise(
      () => getLobbyStateWithUser(lobbyID, userWalletAddress),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (userJoinedLobby(userWalletAddress, lobbyState)) {
      return { success: true, message: '' };
    }
    if (userCreatedLobby(userWalletAddress, lobbyState)) {
      return errorFxn(MiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY);
    }
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN, err);
  }
}

async function closeLobby(lobbyID: string): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('closeLobby');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('cs');
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    const lobbyState = await retryPromise(
      () => getLobbyStateWithUser(lobbyID, userWalletAddress),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (lobbyWasClosed(lobbyState)) {
      return { success: true, message: '' };
    }
    if (!userCreatedLobby(userWalletAddress, lobbyState)) {
      return errorFxn(MiddlewareErrorCode.CANNOT_CLOSE_SOMEONES_LOBBY);
    }
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE, err);
  }
}

async function submitMoves(
  lobbyID: string,
  roundNumber: number,
  move: MatchMove
): Promise<FailedResult | PackedLobbyState> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('s');
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });
  conciseBuilder.addValue({ value: roundNumber.toString(10) });
  conciseBuilder.addValue({ value: move });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    const lobbyState = await retryPromise(
      () => getLobbyStateWithUser(lobbyID, userWalletAddress),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (lobbyState.success) {
      return lobbyState;
    }
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_MOVE_SUBMISSION);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_MOVE_SUBMISSION, err);
  }
}

export const writeEndpoints = {
  createLobby,
  joinLobby,
  closeLobby,
  submitMoves,
};
