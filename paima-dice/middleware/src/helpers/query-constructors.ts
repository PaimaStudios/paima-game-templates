import type { WalletAddress } from '@paima/sdk/utils';
import type { QueryOptions } from '@paima/sdk/mw-core';
import { buildBackendQuery } from '@paima/sdk/mw-core';

export function backendQueryLobbyRaw(lobbyID: string): string {
  const endpoint = 'lobby_raw';
  const options = {
    lobbyID,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryLobbyState(lobbyID: string): string {
  const endpoint = 'lobby_state';
  const options = {
    lobbyID,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQuerySearchLobby(
  nftId: number,
  searchQuery: string,
  page: number,
  count?: number
): string {
  const endpoint = 'search_open_lobbies';
  const options: QueryOptions = { nftId, searchQuery, page };
  if (count !== undefined) {
    options.count = count;
  }

  return buildBackendQuery(endpoint, options);
}

export function backendQueryUserLobbiesBlockheight(nftId: number, blockHeight: number): string {
  const endpoint = 'user_lobbies_blockheight';
  const options = {
    nftId,
    blockHeight,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryRoundStatus(
  lobbyID: string,
  matchWithinLobby: number,
  roundWithinMatch: number
): string {
  const endpoint = 'round_status';
  const options = {
    lobbyID,
    matchWithinLobby,
    roundWithinMatch,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryUserStats(nftId: number): string {
  const endpoint = 'user_stats';
  const options = {
    nftId,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryUserLobbies(nftId: number, count?: number, page?: number): string {
  const endpoint = 'user_lobbies';
  const optsStart: QueryOptions = {};
  if (typeof count !== 'undefined') {
    optsStart.count = count;
  }
  if (typeof page !== 'undefined') {
    optsStart.page = page;
  }
  const options = {
    nftId,
    ...optsStart,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryOpenLobbies(nftId: number, count?: number, page?: number): string {
  const endpoint = 'open_lobbies';
  const options: QueryOptions = { nftId };
  if (typeof count !== 'undefined') {
    options.count = count;
  }
  if (typeof page !== 'undefined') {
    options.page = page;
  }
  return buildBackendQuery(endpoint, options);
}

export function backendQueryRoundExecutor(
  lobbyID: string,
  matchWithinLobby: number,
  roundWithinMatch: number
): string {
  const endpoint = 'round_executor';
  const options = {
    lobbyID,
    matchWithinLobby,
    roundWithinMatch,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryMatchExecutor(lobbyID: string, matchWithinLobby: number): string {
  const endpoint = 'match_executor';
  const options = {
    lobbyID,
    matchWithinLobby,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryNftsForWallet(wallet: WalletAddress): string {
  const endpoint = 'nfts/wallet';
  const options = {
    wallet,
  };
  return buildBackendQuery(endpoint, options);
}
