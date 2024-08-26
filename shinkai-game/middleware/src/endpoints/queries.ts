import type { FailedResult } from '@paima/sdk/mw-core';
import { buildBackendQuery, PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

import type { UserStats } from '@game/utils';

import { buildEndpointErrorFxn } from '../errors';
import type { PackedStats, PackedUserStats } from '../types';

async function getGame(gameId: number): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  let res: Response;
  try {
    const query = buildBackendQuery('game/', { game_id: String(gameId) });
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getNewGame(wallet: string): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  let res: Response;
  try {
    const query = buildBackendQuery('game/new', { wallet });
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getGameRound(
  gameId: number,
  stage: string
): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  let res: Response;
  try {
    const query = buildBackendQuery('game/round', {
      game_id: String(gameId),
      stage,
    });
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getTokens(wallet: string): Promise<PackedStats<any> | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getWorldStats');

  let res: Response;
  try {
    const query = buildBackendQuery('game/tokens', { wallet });
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = await res.json();
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

export const queryEndpoints = {
  getGameRound,
  getTokens,
  getGame,
  getNewGame,
};
