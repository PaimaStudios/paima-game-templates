import type { FailedResult } from '@paima/sdk/mw-core';
import { PaimaMiddlewareErrorCode } from '@paima/sdk/mw-core';

import type {
  DexOrder,
  UserAssetStats,
  UserStats,
  UserTokenStats,
  UserValidMintedAssets,
} from '@game/utils';

import { buildEndpointErrorFxn } from '../errors';
import {
  backendQueryDexOrders,
  backendQueryUserAssetStats,
  backendQueryUserStats,
  backendQueryUserTokenStats,
  backendQueryUserValidMintedAssets,
} from '../helpers/query-constructors';
import type {
  PackedDexOrdersStats,
  PackedUserAssetStats,
  PackedUserStats,
  PackedUserTokenStats,
  PackedUserValidMintedAssetsStats,
} from '../types';

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
): Promise<PackedUserAssetStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getUserAssetStats');

  let res: Response;
  try {
    const query = backendQueryUserAssetStats(walletAddress, userTokenId);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: UserAssetStats };
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getUserValidMintedAssets(
  walletAddress: string
): Promise<PackedUserValidMintedAssetsStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getUserValidMintedAssets');

  let res: Response;
  try {
    const query = backendQueryUserValidMintedAssets(walletAddress);
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: UserValidMintedAssets };
    return {
      success: true,
      stats: j.stats,
    };
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.INVALID_RESPONSE_FROM_BACKEND, err);
  }
}

async function getDexOrders(): Promise<PackedDexOrdersStats | FailedResult> {
  const errorFxn = buildEndpointErrorFxn('getDexOrders');

  let res: Response;
  try {
    const query = backendQueryDexOrders();
    res = await fetch(query);
  } catch (err) {
    return errorFxn(PaimaMiddlewareErrorCode.ERROR_QUERYING_BACKEND_ENDPOINT, err);
  }

  try {
    const j = (await res.json()) as { stats: DexOrder };
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
  getDexOrders,
};
