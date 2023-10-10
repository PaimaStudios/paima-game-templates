import { ENV, retryPromise } from '@paima/sdk/utils';
import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, OldResult, Result } from '@paima/sdk/mw-core';
import {
  awaitBlock,
  getActiveAddress,
  PaimaMiddlewareErrorCode,
  postConciseData,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn, MiddlewareErrorCode } from '../errors';
// import { getLobbyStateWithUser, getNonemptyNewLobbies } from '../helpers/auxiliary-queries';
// import { lobbyWasClosed, userCreatedLobby, userJoinedLobby } from '../helpers/utility-functions';
// import type { MatchMove } from '@hexbattle/game-logic';
// import type { CreateLobbySuccessfulResponse, PackedLobbyState } from '../types';

// const RETRY_PERIOD = 1000;
// const RETRIES_COUNT = 8;

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

async function createLobby(numOfPlayers: number): Promise<FailedResult | { success: true, data: { lobbyId: string, lobbyStatus: string }}> {
  const errorFxn = buildEndpointErrorFxn('createLobby');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('c');
  conciseBuilder.addValues([
    { value: numOfPlayers.toString(10) },
  ]);

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    return {
      success: true,
      data: {
        lobbyId: 'TODO', // newLobbies.lobbies[0].lobby_id,
        lobbyStatus: 'open',
      }
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION, err);
  }
}

async function joinLobby(lobbyId: string): Promise<FailedResult | { success: true, data: { lobbyId: string, lobbyStatus: string } }> {
  const errorFxn = buildEndpointErrorFxn('joinLobby');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('j');
  conciseBuilder.addValue({ value: lobbyId, isStateIdentifier: true });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    return  {
      success: true,
      data: { 
        lobbyId: 'TODO',
        lobbyStatus: 'open'
      }
    }
//     const lobbyState = await retryPromise(
//       () => getLobbyStateWithUser(lobbyID, userWalletAddress),
//       RETRY_PERIOD,
//       RETRIES_COUNT
//     );
//     if (userJoinedLobby(userWalletAddress, lobbyState)) {
//       return { success: true, message: '' };
//     }
//     if (userCreatedLobby(userWalletAddress, lobbyState)) {
//       return errorFxn(MiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY);
//     }
//     return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN, err);
  }
}


async function surrender(lobbyId: string): Promise<FailedResult | { success: true, data: { lobbyId: string, lobbyStatus: string } }> {
  const errorFxn = buildEndpointErrorFxn('surrender');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('x');
  conciseBuilder.addValue({ value: lobbyId, isStateIdentifier: true });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    return  {
      success: true,
      data: { 
        lobbyId: 'TODO',
        lobbyStatus: 'open'
      }
    }
//     const lobbyState = await retryPromise(
//       () => getLobbyStateWithUser(lobbyID, userWalletAddress),
//       RETRY_PERIOD,
//       RETRIES_COUNT
//     );
//     if (userJoinedLobby(userWalletAddress, lobbyState)) {
//       return { success: true, message: '' };
//     }
//     if (userCreatedLobby(userWalletAddress, lobbyState)) {
//       return errorFxn(MiddlewareErrorCode.CANNOT_JOIN_OWN_LOBBY);
//     }
//     return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN, err);
  }
}


// async function closeLobby(lobbyID: string): Promise<OldResult> {
//   const errorFxn = buildEndpointErrorFxn('closeLobby');

//   const query = getUserWallet(errorFxn);
//   if (!query.success) return query;
//   const userWalletAddress = query.result;

//   const conciseBuilder = builder.initialize(undefined);
//   conciseBuilder.setPrefix('cs');
//   conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });

//   const response = await postConciseData(conciseBuilder.build(), errorFxn);
//   if (!response.success) return response;

//   const currentBlock = response.blockHeight;
//   try {
//     await awaitBlock(currentBlock);
//     const lobbyState = await retryPromise(
//       () => getLobbyStateWithUser(lobbyID, userWalletAddress),
//       RETRY_PERIOD,
//       RETRIES_COUNT
//     );
//     if (lobbyWasClosed(lobbyState)) {
//       return { success: true, message: '' };
//     }
//     if (!userCreatedLobby(userWalletAddress, lobbyState)) {
//       return errorFxn(MiddlewareErrorCode.CANNOT_CLOSE_SOMEONES_LOBBY);
//     }
//     return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE);
//   } catch (err) {
//     return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CLOSE, err);
//   }
// }

async function submitMoves(
  lobbyID: string,
  roundNumber: number,
  move: string[], // MatchMove
): Promise<FailedResult | { success: true, data: { message: string } }> {
  const errorFxn = buildEndpointErrorFxn('submitMoves');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('m');
  conciseBuilder.addValue({ value: lobbyID, isStateIdentifier: true });
  conciseBuilder.addValue({ value: roundNumber.toString(10) });
  conciseBuilder.addValue({ value: move.join(',') });

  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    // const lobbyState = await retryPromise(
    //   () => getLobbyStateWithUser(lobbyID, userWalletAddress),
    //   RETRY_PERIOD,
    //   RETRIES_COUNT
    // );
    // if (lobbyState.success) {
      // return lobbyState;
    // }
    return { success: true, data: { message: 'OK' } };
    // return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_MOVE_SUBMISSION);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_MOVE_SUBMISSION, err);
  }
}

export const writeEndpoints = {
  // createLobby,
  // joinLobby,
  // closeLobby,
  submitMoves,
};
