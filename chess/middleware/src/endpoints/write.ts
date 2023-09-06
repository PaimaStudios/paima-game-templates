import { ENV, retryPromise } from 'paima-sdk/paima-utils';
import { builder } from 'paima-sdk/paima-concise';
import type { EndpointErrorFxn, FailedResult, OldResult, Result } from 'paima-sdk/paima-mw-core';
import {
  awaitBlock,
  buildBackendQuery,
  getActiveAddress,
  PaimaMiddlewareErrorCode,
  postConciseData,
} from 'paima-sdk/paima-mw-core';
import { paimaEndpoints } from 'paima-sdk/paima-mw-core';

import { buildEndpointErrorFxn, MiddlewareErrorCode } from '../errors';
import { getLobbyStateWithUser, getNonemptyNewLobbies } from '../helpers/auxiliary-queries';
import { lobbyWasClosed, userCreatedLobby, userJoinedLobby } from '../helpers/utility-functions';
import type { MatchMove } from '@chess/game-logic';
import type { CreateLobbySuccessfulResponse, PackedLobbyState } from '../types';

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

// Default number of blocks that an endpoint should wait before considering the write command to have failed
const num_of_blocks_to_wait = Math.max((10 / ENV.BLOCK_TIME) | 0, 3); // Wait 10[s] and at least 3 blocks.

// Compare block with current block in backend.
const checkIfNextBlockIsReady = async (startBlock: number): Promise<number> => {
  const nextBlock = await paimaEndpoints.getLatestProcessedBlockHeight();
  if (nextBlock.success && nextBlock.result > startBlock) return nextBlock.result;
  return 0;
};

const wait = (ms = 1000): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), ms));

// Wait until next backend produced next block.
export const waitForNextBlock = async () => {
  const startBlock = await paimaEndpoints.getLatestProcessedBlockHeight();
  if (startBlock.success) {
    let nextblock = 0;
    while (!nextblock) {
      await wait(); // check blockheight each 1000[ms];
      nextblock = await checkIfNextBlockIsReady(startBlock.result);
    }
    return nextblock;
  }
  throw new Error('Could not get latest processed block height');
};

// This function waits until the next-blocks contains the expected data.
//
// 0) wait until next block is produced
// 1) input.query is executed
// 2) input.query is checked with input.check
// 3) if (2) true then return  value of(1)
// 4) if (2) false then goto to (0)
async function waitCondition<T>(input: {
  query: (nextBlock: number) => Promise<T | undefined>;
  check: (x: T | undefined) => boolean;
}): Promise<T> {
  let retries = num_of_blocks_to_wait;
  let lastResult!: T | undefined;
  while (retries > 0) {
    const block = await waitForNextBlock();
    const lastResult = await input.query(block);
    if (input.check(lastResult)) return lastResult as T;
    retries -= 1;
  }
  console.log('Block (maybe) not processed. Frontend will not continue waiting.');
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return lastResult!;
}

export function backendQueryConfirmInputAcceptance(
  gameInput: string,
  userAddress: string,
  blockHeight: number
): string {
  const endpoint = 'confirm_input_acceptance';
  const options = { gameInput, userAddress, blockHeight };
  return buildBackendQuery(endpoint, options);
}

async function getConfirmInputAcceptance(
  gameInput: string,
  userAddress: string,
  blockHeight: number
): Promise<Result<boolean>> {
  const errorFxn = buildEndpointErrorFxn('confirmInputAcceptance');

  let res: Response;
  try {
    const query = backendQueryConfirmInputAcceptance(gameInput, userAddress, blockHeight);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    return await res.json();
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

const waitUntilTXReady = async (
  blockAtSubmition: number,
  gameInput: string,
  userWalletAddress: string
) => {
  const blockStatus: { bh: number; status: boolean | undefined }[] = [];

  const input = {
    query: async (blockHeight: number): Promise<boolean | undefined> => {
      // Add to queue all not checked blockheights
      for (let i = blockAtSubmition; i <= blockHeight; i++) {
        if (!blockStatus.find(bs => bs.bh === i)) {
          blockStatus.push({ bh: i, status: undefined });
        }
      }

      for (const block of blockStatus) {
        // Check all blockheights not yet checked
        if (block.status === undefined) {
          const data = await getConfirmInputAcceptance(gameInput, userWalletAddress, block.bh);
          if (data.success) {
            if (data.result) return true;
            block.status = false;
          }
        }
      }
      return false;
    },
    check: (x: boolean | undefined): boolean => {
      return x || false;
    },
  };
  return await waitCondition(input);
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

  const blockAtSubmition = await paimaEndpoints.getLatestProcessedBlockHeight();
  if (!blockAtSubmition.success)
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION);

  const gameInput = conciseBuilder.build();
  const response = await postConciseData(gameInput, errorFxn);
  if (!response.success) return response;

  try {
    await waitUntilTXReady(blockAtSubmition.result, gameInput, userWalletAddress);

    const currentBlock = response.blockHeight;

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

  const blockAtSubmition = await paimaEndpoints.getLatestProcessedBlockHeight();
  if (!blockAtSubmition.success)
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION);
  const gameInput = conciseBuilder.build();
  const response = await postConciseData(gameInput, errorFxn);
  if (!response.success) return response;

  try {
    await waitUntilTXReady(blockAtSubmition.result, gameInput, userWalletAddress);
    const currentBlock = response.blockHeight;
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

  const blockAtSubmition = await paimaEndpoints.getLatestProcessedBlockHeight();
  if (!blockAtSubmition.success)
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION);
  const gameInput = conciseBuilder.build();
  const response = await postConciseData(gameInput, errorFxn);
  if (!response.success) return response;

  try {
    await waitUntilTXReady(blockAtSubmition.result, gameInput, userWalletAddress);
    const currentBlock = response.blockHeight;
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

  const blockAtSubmition = await paimaEndpoints.getLatestProcessedBlockHeight();
  if (!blockAtSubmition.success)
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION);
  const gameInput = conciseBuilder.build();
  const response = await postConciseData(gameInput, errorFxn);
  if (!response.success) return response;

  try {
    await waitUntilTXReady(blockAtSubmition.result, gameInput, userWalletAddress);
    const currentBlock = response.blockHeight;
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
