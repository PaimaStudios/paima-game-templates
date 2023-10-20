import type { QueryOptions, Result } from '@paima/sdk/mw-core';
import { buildBackendQuery } from '@paima/sdk/mw-core';
import { type MatchExecutor, type RoundExecutor } from '@paima/sdk/executors';

import {
  type MatchState,
  type TickEvent,
  type SearchOpenLobbiesResponse,
  type LobbyRawResponse,
  type LobbyStateResponse,
  type UserStatsResponse,
  type UserLobbiesBlockHeightResponse,
  type UserLobbiesResponse,
  type OpenLobbiesResponse,
  type RoundExecutorResponse,
  type MatchExecutorResponse,
  type AccountNftResponse,
  type GetCardsResponse,
  type GetPacksResponse,
  type GetTradeNftsResponse,
} from '@cards/game-logic';

import { buildEndpointErrorFxn } from '../errors';
import { auxGet } from '../helpers/auxiliary-queries';
import { buildMatchExecutor, buildRoundExecutor } from '../helpers/executors';
import type { WalletAddress } from '@paima/sdk/utils';
import { MiddlewareErrorCode } from '@cards/game-logic';

async function getLobbyRaw(lobbyID: string): Promise<Result<LobbyRawResponse>> {
  const errorFxn = buildEndpointErrorFxn('getLobbyRaw');
  const builtQuery = buildBackendQuery('lobby/raw', { lobbyID });
  return await auxGet(builtQuery, errorFxn);
}

async function getLobbyState(lobbyID: string): Promise<Result<LobbyStateResponse>> {
  const errorFxn = buildEndpointErrorFxn('getLobbyState');
  const builtQuery = buildBackendQuery('lobby/state', { lobbyID });
  return await auxGet(builtQuery, errorFxn);
}

async function getLobbySearch(
  nftId: number,
  searchQuery: string,
  page: number,
  count?: number
): Promise<Result<SearchOpenLobbiesResponse>> {
  const errorFxn = buildEndpointErrorFxn('getLobbySearch');
  const options: QueryOptions = { nftId, searchQuery, page };
  if (count !== undefined) {
    options.count = count;
  }
  const builtQuery = buildBackendQuery('lobby/searchOpen', options);
  return await auxGet(builtQuery, errorFxn);
}

async function getUserStats(nftId: number): Promise<Result<UserStatsResponse>> {
  const errorFxn = buildEndpointErrorFxn('getUserStats');
  const builtQuery = buildBackendQuery('lobby/stats', { nftId });
  return await auxGet(builtQuery, errorFxn);
}

async function getNewLobbies(
  nftId: number,
  blockHeight: number
): Promise<Result<UserLobbiesBlockHeightResponse>> {
  const errorFxn = buildEndpointErrorFxn('getNewLobbies');
  const builtQuery = buildBackendQuery('lobby/userBlockHeight', {
    nftId,
    blockHeight,
  });
  return await auxGet(builtQuery, errorFxn);
}

async function getUserLobbiesMatches(
  nftId: number,
  page: number,
  count?: number
): Promise<Result<UserLobbiesResponse>> {
  const errorFxn = buildEndpointErrorFxn('getUserLobbiesMatches');
  const options: QueryOptions = {
    nftId,
  };
  if (typeof count !== 'undefined') {
    options.count = count;
  }
  if (typeof page !== 'undefined') {
    options.page = page;
  }
  const builtQuery = buildBackendQuery('lobby/user', options);
  return await auxGet(builtQuery, errorFxn);
}

async function getOpenLobbies(
  nftId: number,
  page: number,
  count?: number
): Promise<Result<OpenLobbiesResponse>> {
  const errorFxn = buildEndpointErrorFxn('getOpenLobbies');
  const options: QueryOptions = { nftId };
  if (typeof count !== 'undefined') {
    options.count = count;
  }
  if (typeof page !== 'undefined') {
    options.page = page;
  }
  const builtQuery = buildBackendQuery('lobby/open', options);
  return await auxGet(builtQuery, errorFxn);
}

async function getRoundExecutor(
  lobbyId: string,
  matchWithinLobby: number,
  roundWithinMatch: number,
  matchState: MatchState
): Promise<Result<RoundExecutor<MatchState, TickEvent>>> {
  const errorFxn = buildEndpointErrorFxn('getRoundExecutor');
  const builtQuery = buildBackendQuery('executor/round', {
    lobbyID: lobbyId,
    matchWithinLobby,
    roundWithinMatch,
  });
  const auxResult = await auxGet<RoundExecutorResponse>(builtQuery, errorFxn);
  if (!auxResult.success) return auxResult;
  if ('error' in auxResult.result)
    return errorFxn(MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, auxResult.result.error);

  try {
    const executor = buildRoundExecutor({
      ...auxResult.result,
      matchState,
    });
    return {
      success: true,
      result: executor,
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, err);
  }
}

async function getMatchExecutor(
  lobbyId: string,
  matchWithinLobby: number
): Promise<Result<MatchExecutor<MatchState, TickEvent>>> {
  const errorFxn = buildEndpointErrorFxn('getMatchExecutor');
  const builtQuery = buildBackendQuery('executor/match', {
    lobbyID: lobbyId,
    matchWithinLobby,
  });
  const auxResult = await auxGet<MatchExecutorResponse>(builtQuery, errorFxn);
  if (!auxResult.success) return auxResult;
  if (auxResult.result == null) return errorFxn(MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR);

  try {
    const executor = buildMatchExecutor(auxResult.result);
    return {
      success: true,
      result: executor,
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, err);
  }
}

async function getNftForWallet(wallet: WalletAddress): Promise<Result<AccountNftResponse>> {
  const errorFxn = buildEndpointErrorFxn('getNftForWallet');
  const builtQuery = buildBackendQuery('user/accountNft', { wallet });
  return await auxGet(builtQuery, errorFxn);
}

async function getUserCards(nftId: number): Promise<Result<GetCardsResponse>> {
  const errorFxn = buildEndpointErrorFxn('getUserCards');
  const builtQuery = buildBackendQuery('user/cards', { nftId });
  return await auxGet(builtQuery, errorFxn);
}

async function getUserPacks(nftId: number): Promise<Result<GetPacksResponse>> {
  const errorFxn = buildEndpointErrorFxn('getUserPacks');
  const builtQuery = buildBackendQuery('user/packs', { nftId });
  return await auxGet(builtQuery, errorFxn);
}

async function getUserTradeNfts(nftId: number): Promise<Result<GetTradeNftsResponse>> {
  const errorFxn = buildEndpointErrorFxn('getUserTradeNfts');
  const builtQuery = buildBackendQuery('user/tradeNfts', { nftId });
  return await auxGet(builtQuery, errorFxn);
}

export const queryEndpoints = {
  getUserStats,
  getLobbyRaw,
  getLobbyState,
  getLobbySearch,
  getOpenLobbies,
  getUserLobbiesMatches,
  getNewLobbies,
  getRoundExecutor,
  getMatchExecutor,
  getNftForWallet,
  getUserCards,
  getUserPacks,
  getUserTradeNfts,
};
