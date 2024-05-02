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

export function backendQueryUserTokenStats(wallet: WalletAddress, userTokenId: number): string {
  const endpoint = 'user_token_state';
  const options = {
    wallet,
    userTokenId,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryUserAssetStats(wallet: WalletAddress, userTokenId: number): string {
  const endpoint = 'user_asset_state';
  const options = {
    wallet,
    userTokenId,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryUserValidMintedAssets(wallet: WalletAddress): string {
  const endpoint = 'user_valid_minted_assets';
  const options = {
    wallet,
  };
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
