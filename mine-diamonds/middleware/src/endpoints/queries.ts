import type { FailedResult, Result } from '@paima/sdk/mw-core';
import { PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

import type { MatchExecutorData, RoundExecutorData, UserStats, UserTokenStats } from '@game/utils';

import { buildEndpointErrorFxn, MiddlewareErrorCode } from '../errors';
import { buildMatchExecutor, buildRoundExecutor } from '../helpers/executors';
import {
  backendQueryMatchExecutor,
  backendQueryRoundExecutor,
  backendQueryUserAssetStats,
  backendQueryUserStats,
  backendQueryUserTokenStats,
  backendQueryUserValidMintedAssets,
} from '../helpers/query-constructors';
import type { MatchExecutor, PackedUserStats, PackedUserTokenStats, RoundExecutor } from '../types';
import type { MatchState, TickEvent } from '@game/game-logic';

async function getRoundExecutor(
  lobbyId: string,
  roundNumber: number
): Promise<Result<RoundExecutor<MatchState, TickEvent>>> {
  const errorFxn = buildEndpointErrorFxn('getRoundExecutor');

  // Retrieve data:
  let res: Response;
  try {
    const query = backendQueryRoundExecutor(lobbyId, roundNumber);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  let data: RoundExecutorData;
  try {
    data = (await res.json()) as RoundExecutorData;
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }

  // Process data:
  try {
    const executor = buildRoundExecutor(data, roundNumber);
    return {
      success: true,
      result: executor,
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, err);
  }
}

async function getMatchExecutor(
  lobbyId: string
): Promise<Result<MatchExecutor<MatchState, TickEvent>>> {
  const errorFxn = buildEndpointErrorFxn('getMatchExecutor');

  // Retrieve data:
  let res: Response;
  try {
    const query = backendQueryMatchExecutor(lobbyId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  let data: MatchExecutorData;
  try {
    data = (await res.json()) as MatchExecutorData;
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }

  // Process data:
  try {
    const executor = buildMatchExecutor(data);
    return {
      success: true,
      result: executor,
    };
  } catch (err) {
    return errorFxn(MiddlewareErrorCode.UNABLE_TO_BUILD_EXECUTOR, err);
  }
}

async function getUserStats(walletAddress: string): Promise<PackedUserStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getUserStats');

  let res: Response;
  try {
    const query = backendQueryUserStats(walletAddress);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: UserStats };
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getUserTokenStats(
  walletAddress: string,
  userTokenId: number
): Promise<PackedUserTokenStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getUserTokenStats');

  let res: Response;
  try {
    const query = backendQueryUserTokenStats(walletAddress, userTokenId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: UserTokenStats };
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getUserAssetStats(
  walletAddress: string,
  userTokenId: number
): Promise<PackedUserTokenStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getUserAssetStats');

  let res: Response;
  try {
    const query = backendQueryUserAssetStats(walletAddress, userTokenId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: UserTokenStats };
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getUserValidMintedAssets(
  walletAddress: string,
  userTokenId: number
): Promise<PackedUserTokenStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getUserValidMintedAssets');

  let res: Response;
  try {
    const query = backendQueryUserValidMintedAssets(walletAddress);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: UserTokenStats };
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export const queryEndpoints = {
  getUserStats,
  getUserTokenStats,
  getUserAssetStats,
  getUserValidMintedAssets,
  getRoundExecutor,
  getMatchExecutor,
};
