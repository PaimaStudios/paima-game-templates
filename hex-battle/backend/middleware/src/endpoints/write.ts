import { builder } from '@paima/sdk/concise';
import type { EndpointErrorFxn, FailedResult, Result } from '@paima/sdk/mw-core';
import {
  awaitBlock,
  getDefaultActiveAddress,
  PaimaMiddlewareErrorCode,
  postConciseData,
} from '@paima/sdk/mw-core';

import { buildEndpointErrorFxn, MiddlewareErrorCode } from '../errors';
import { getLatestCreatedLobby, getLobby } from './queries';

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
  numOfPlayers: number,
  units: string,
  buildings: string,
  gold: number,
  initTiles: number,
  map: string[]
): Promise<FailedResult | { success: true; data: { lobbyId: string; lobbyStatus: string } }> {
  const errorFxn = buildEndpointErrorFxn('createLobby');

  const query = getUserWallet(errorFxn);
  if (!query.success) return query;
  // createLobby         = c|numOfPlayers|units|buildings|gold|initTiles|map|timeLimit|roundLimit
  const userWalletAddress = query.result;
 
  const conciseBuilder = builder.initialize(undefined);
  conciseBuilder.setPrefix('c');
  conciseBuilder.addValues([{ value: numOfPlayers.toString(10) }]);
  conciseBuilder.addValue({ value: units });
  conciseBuilder.addValue({ value: buildings });
  conciseBuilder.addValue({ value: String(gold) });
  conciseBuilder.addValue({ value: String(initTiles) });
  conciseBuilder.addValue({ value: map.join(',') });
  conciseBuilder.addValue({ value: '9999' });
  conciseBuilder.addValue({ value: '9999' });
  const response = await postConciseData(conciseBuilder.build(), errorFxn);
  if (!response.success) return response;

  const currentBlock = response.blockHeight;
  try {
    await awaitBlock(currentBlock);
    return await getLatestCreatedLobby(userWalletAddress);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_CREATION, err);
  }
}

async function joinLobby(lobbyId: string): Promise<FailedResult | { success: true; data: Object }> {
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
    return await getLobby(lobbyId);
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN, err);
  }
}

async function surrender(
  lobbyId: string
): Promise<FailedResult | { success: true; data: { lobbyId: string; lobbyStatus: string } }> {
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
    return {
      success: true,
      data: {
        lobbyId: 'TODO',
        lobbyStatus: 'open',
      },
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_LOBBY_JOIN, err);
  }
}

async function submitMoves(
  lobbyID: string,
  roundNumber: number,
  move: string[]
): Promise<FailedResult | { success: true; data: { message: string } }> {
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
    return { success: true, data: { message: 'OK' } };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.FAILURE_VERIFYING_MOVE_SUBMISSION, err);
  }
}

export const writeEndpoints = {
  createLobby,
  joinLobby,
  surrender,
  submitMoves,
};
