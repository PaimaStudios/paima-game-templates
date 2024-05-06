import type {
  IGetDexOrdersResult,
  IGetUserAssetStatsResult,
  IGetUserStatsResult,
  IGetUserTokenStatsResult,
  IGetUserValidMintedAssetsResult,
} from '@game/db';

export type UserStats = IGetUserStatsResult;

export type UserTokenStats = IGetUserTokenStatsResult;

export type UserAssetStats = IGetUserAssetStatsResult;

export type UserValidMintedAssets = IGetUserValidMintedAssetsResult;

export type DexOrder = IGetDexOrdersResult;
