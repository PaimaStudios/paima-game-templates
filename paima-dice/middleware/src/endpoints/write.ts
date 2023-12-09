import { retryPromise } from '@paima/sdk/utils';
import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, OldResult, Result } from '@paima/sdk/mw-core';
import {
  awaitBlock,
  postConciselyEncodedData,
  getDefaultActiveAddress,
  PaimaMiddlewareErrorCode,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn, MiddlewareErrorCode } from '../errors';
import { getLobbyStateWithUser, getNonemptyNewLobbies } from '../helpers/auxiliary-queries';
import { lobbyWasClosed, userCreatedLobby, userJoinedLobby } from '../helpers/utility-functions';
import type { CreateLobbySuccessfulResponse } from '../types';

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
  creatorNftId: number,
  numberOfRounds: number,
  roundLength: number,
  playTimePerPlayer: number,
  isHidden = false,
  isPractice = false
): Promise<CreateLobbySuccessfulResponse | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('createLobby');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('c');
  conciseBuilder.addValues([
    { value: creatorNftId.toString(10) },
    { value: numberOfRounds.toString(10) },
    { value: roundLength.toString(10) },
    { value: playTimePerPlayer.toString(10) },
    { value: isHidden ? 'T' : '' },
    { value: isPractice ? 'T' : '' },
  ]);

  let currentBlockVar: number;
  try {
    // TODO: do not use deprecated function
    const result = await postConciselyEncodedData(conciseBuilder.build());
    if (!result.success) {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, result.errorMessage);
    }
    currentBlockVar = result.result;

    if (currentBlockVar < 0) {
      return errorFxn(
        PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN,
        `Received block height: ${currentBlockVar}`
      );
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
  const currentBlock = currentBlockVar;

  try {
    await awaitBlock(currentBlock);
    const newLobbies = await retryPromise(
      () => getNonemptyNewLobbies(creatorNftId, currentBlock),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (
      !newLobbies.hasOwnProperty('lobbies') ||
      !Array.isArray(newLobbies.lobbies) ||
      newLobbies.lobbies.length === 0
    ) {
      return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION);
    } else {
      return {
        success: true,
        lobbyID: newLobbies.lobbies[0].lobby_id,
        lobbyStatus: 'open',
      };
    }
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION, err);
  }
}

async function joinLobby(nftId: number, lobbyID: string): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('joinLobby');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('j');
  conciseBuilder.addValues([
    { value: nftId.toString(10) },
    { value: lobbyID, isStateIdentifier: true },
  ]);

  let currentBlockVar: number;
  try {
    const result = await postConciselyEncodedData(conciseBuilder.build());
    if (!result.success) {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, result.errorMessage);
    }
    currentBlockVar = result.result;

    if (currentBlockVar < 0) {
      return errorFxn(
        PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN,
        `Received block height: ${currentBlockVar}`
      );
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
  const currentBlock = currentBlockVar;

  try {
    await awaitBlock(currentBlock);
    const lobbyState = await retryPromise(
      () => getLobbyStateWithUser(lobbyID, nftId),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (userJoinedLobby(nftId, lobbyState)) {
      return {
        success: true,
        message: '',
      };
    } else if (userCreatedLobby(nftId, lobbyState)) {
      return errorFxn(MiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY);
    } else {
      return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN);
    }
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN);
  }
}

async function closeLobby(nftId: number, lobbyID: string): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('closeLobby');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('cs');
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });

  let currentBlockVar: number;
  try {
    const result = await postConciselyEncodedData(conciseBuilder.build());
    if (!result.success) {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, result.errorMessage);
    }
    currentBlockVar = result.result;

    if (currentBlockVar < 0) {
      return errorFxn(
        PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN,
        `Received block height: ${currentBlockVar}`
      );
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
  const currentBlock = currentBlockVar;

  try {
    await awaitBlock(currentBlock);
    const lobbyState = await retryPromise(
      () => getLobbyStateWithUser(lobbyID, nftId),
      RETRY_PERIOD,
      RETRIES_COUNT
    );
    if (lobbyWasClosed(lobbyState)) {
      return { success: true, message: '' };
    } else if (!userCreatedLobby(nftId, lobbyState)) {
      return errorFxn(MiddlewareErrorCode.CANNOT_CLOSE_SOMEONES_LOBBY);
    } else {
      return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE);
    }
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE);
  }
}

async function submitMoves(
  nftId: number,
  lobbyID: string,
  matchWithinLobby: number,
  roundWithinMatch: number,
  rollAgain: boolean
): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix('s');
  conciseBuilder.addValue({ value: nftId.toString(10) });
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });
  conciseBuilder.addValue({ value: matchWithinLobby.toString(10) });
  conciseBuilder.addValue({ value: roundWithinMatch.toString(10) });
  conciseBuilder.addValue({ value: rollAgain ? 'T' : 'F' });

  try {
    const result = await postConciselyEncodedData(conciseBuilder.build());
    if (result.success) {
      return { success: true, message: '' };
    } else {
      return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN);
    }
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_POSTING_TO_CHAIN, err);
  }
}

export const writeEndpoints = {
  createLobby,
  joinLobby,
  closeLobby,
  submitMoves,
};
