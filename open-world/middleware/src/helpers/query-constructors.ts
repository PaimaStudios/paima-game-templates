import type { WalletAddress } from '@paima/sdk/utils';
import type { QueryOptions } from '@paima/sdk/mw-core';
import { buildBackendQuery } from '@paima/sdk/mw-core';

export function backendQueryUserStats(wallet: WalletAddress): string {
  const endpoint = 'user_stats';
  const options = {
    wallet,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryWorldStats(): string {
  const endpoint = 'world_state';
  const options = {};
  return buildBackendQuery(endpoint, options);
}

export function backendQueryRoundExecutor(lobbyID: string, round: number): string {
  const endpoint = 'round_executor';
  const options = {
    lobbyID,
    round,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryMatchExecutor(lobbyID: string): string {
  const endpoint = 'match_executor';
  const options = {
    lobbyID,
  };
  return buildBackendQuery(endpoint, options);
}

