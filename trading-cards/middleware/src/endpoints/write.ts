import { retryPromise } from '@paima/sdk/utils';
import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, OldResult, Result } from '@paima/sdk/mw-core';
import {
  awaitBlock,
  postConciselyEncodedData,
  getActiveAddress,
  PaimaMiddlewareErrorCode,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn } from '../errors';
import { getLobbyStateWithUser, getNonemptyNewLobbies } from '../helpers/auxiliary-queries';
import { lobbyWasClosed, userCreatedLobby, userJoinedLobby } from '../helpers/utility-functions';
import type { CreateLobbySuccessfulResponse } from '../types';
import type { CardDbId, Move } from '@cards/game-logic';
import { PARSER_PREFIXES, serializeMove } from '@cards/game-logic';
import { MiddlewareErrorCode } from '@cards/game-logic';

const RETRY_PERIOD = 1000;
const RETRIES_COUNT = 8;

const getUserWallet = (errorFxn: EndpointErrorFxn): Result<string> => {
  try {
    const wallet = getActiveAddress();
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
  commitments: Uint8Array,
  numberOfRounds: number,
  turnLength: number,
  isHidden = false,
  isPractice = false
): Promise<CreateLobbySuccessfulResponse | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('createLobby');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix(PARSER_PREFIXES.createdLobby);
  conciseBuilder.addValues([
    { value: creatorNftId.toString(10) },
    { value: Buffer.from(commitments).toString('base64') },
    { value: numberOfRounds.toString(10) },
    { value: turnLength.toString(10) },
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

async function joinLobby(
  nftId: number,
  lobbyID: string,
  commitments: Uint8Array
): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('joinLobby');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix(PARSER_PREFIXES.joinedLobby);
  conciseBuilder.addValues([
    { value: nftId.toString(10) },
    { value: lobbyID, isStateIdentifier: true },
    { value: Buffer.from(commitments).toString('base64') },
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
  conciseBuilder.setPrefix(PARSER_PREFIXES.closedLobby);
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
  move: Move
): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix(PARSER_PREFIXES.submittedMoves);
  conciseBuilder.addValue({ value: nftId.toString(10) });
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });
  conciseBuilder.addValue({ value: matchWithinLobby.toString(10) });
  conciseBuilder.addValue({ value: roundWithinMatch.toString(10) });
  conciseBuilder.addValue({ value: serializeMove(move) });

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

async function setTradeNftCards(tradeNftId: number, cards: CardDbId[]): Promise<OldResult> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const conciseBuilder = builder.initialize();
  conciseBuilder.setPrefix(PARSER_PREFIXES.setTradeNftCards);
  conciseBuilder.addValue({ value: tradeNftId.toString(10) });
  conciseBuilder.addValue({ value: cards.map(card => card.toString()).join(',') });

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
  setTradeNftCards,
};
