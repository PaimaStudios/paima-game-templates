import type { EndpointErrorFxn, FailedResult, Result } from '@paima/sdk/mw-core';
import { PaimaMiddlewareErrorCode, getActiveAddress } from '@paima/sdk/mw-core';
import { buildEndpointErrorFxn } from '../errors';
import {
  getLatestCreatedLobby as getLatestCreatedLobby_,
  getLobby as getLobby_,
  getMoves,
  getMyGames as getMyGames_,
  getOpenLobbies as getOpenLobbies_,
  getLobbyMap as getLobbyMap_,
  getLeaderboardByLatest,
  getLeaderboardByWins,
  getLeaderboardByPlayed,
  isGameOver as isGameOver_,
} from '../helpers/query-constructors';

const getUserWallet = (wallet: string | null, errorFxn: EndpointErrorFxn): Result<string> => {
  if (wallet) return { success: true, result: wallet };
  try {
    const _wallet = getActiveAddress();
    if (_wallet.length === 0) {
      return errorFxn(PaimaMiddlewareErrorCode.WALLET_NOT_CONNECTED);
    }
    return { success: true, result: _wallet };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INTERNAL_INVALID_POSTING_MODE, err);
  }
};

export async function getLobby(
  lobbyId: string
): Promise<FailedResult | { success: true; data: Object }> {
  const errorFxn = buildEndpointErrorFxn('get_lobby_by_id');

  const query = getUserWallet(null, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = getLobby_(lobbyId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: j, // lobby {}, players:[], rounds:[]
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getLobbyMap(
  lobbyId: string
): Promise<FailedResult | { success: true; data: Object }> {
  const errorFxn = buildEndpointErrorFxn('get_lobby_by_id');

  const query = getUserWallet(null, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = getLobbyMap_(lobbyId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: j, // lobby {}, players:[], rounds:[]
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getLatestCreatedLobby(
  wallet: string | null = null
): Promise<FailedResult | { success: true; data: any }> {
  const errorFxn = buildEndpointErrorFxn('get_latest_created_lobby');

  const query = getUserWallet(wallet, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = getLatestCreatedLobby_(userWalletAddress);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: j.lobby,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function isGameOver(lobby_id: string) {
  const errorFxn = buildEndpointErrorFxn('get_latest_created_lobby');

  const query = getUserWallet(null, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = isGameOver_(lobby_id);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: {
        isGameOver: j.isGameOver,
        current_round: j.current_round,
      },
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getMoveForRound(
  lobby_id: string,
  round: number
): Promise<FailedResult | { success: true; data: any }> {
  const errorFxn = buildEndpointErrorFxn('get_latest_created_lobby');

  const query = getUserWallet(null, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = getMoves(lobby_id, round);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: j.move,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getOpenLobbies(
  page: number = 1,
  count: number = 100,
  wallet: string | null = null
): Promise<FailedResult | { success: true; data: any[] }> {
  const errorFxn = buildEndpointErrorFxn('getOpenLobbies');

  const query = getUserWallet(wallet, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = getOpenLobbies_(userWalletAddress, count, page);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: j.lobbies,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getMyGames(
  page: number = 1,
  count: number = 100,
  wallet: string | null = null
): Promise<FailedResult | { success: true; data: any[] }> {
  const errorFxn = buildEndpointErrorFxn('getOpenLobbies');

  const query = getUserWallet(wallet, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  let res: Response;
  try {
    const query = getMyGames_(userWalletAddress, count, page);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      data: j.lobbies,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export async function getLeaderBoard(
  wallet: string | null = null,
  type: 'latest' | 'wins' | 'played'
): Promise<FailedResult | { success: true; data: any[] }> {
  const errorFxn = buildEndpointErrorFxn('getOpenLobbies');

  const query = getUserWallet(wallet, errorFxn);
  if (!query.success) return query;
  const userWalletAddress = query.result;

  try {
    let query_ = '';
    switch (type) {
      case 'latest':
        query_ = getLeaderboardByLatest(userWalletAddress);
        break;
      case 'wins':
        query_ = getLeaderboardByWins(userWalletAddress);
        break;
      case 'played':
        query_ = getLeaderboardByPlayed(userWalletAddress);
        break;
    }
    const res: Response = await fetch(query_);
    const j = await res.json();
    return {
      success: true,
      data: j.players,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }
}

export const queryEndpoints = {
  getLobby,
  isGameOver,
  getLobbyMap,
  getLatestCreatedLobby,
  getOpenLobbies,
  getMyGames,
  getMoveForRound,
  getUserWallet,
  getLeaderBoard,
};
