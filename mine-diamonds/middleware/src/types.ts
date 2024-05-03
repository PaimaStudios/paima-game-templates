import type { RoundExecutor, MatchExecutor } from '@paima/sdk/executors';
import type { Hash } from '@paima/sdk/utils';

import type {
  BaseRoundStatus,
  DexOrder,
  UserAssetStats,
  UserStats,
  UserTokenStats,
  UserValidMintedAssets,
} from '@game/utils';

export type { RoundExecutor, MatchExecutor };

export interface RoundEnd {
  blocks: number;
  seconds: number;
}
export interface RoundExecutionState extends BaseRoundStatus {
  roundEndsInBlocks: number;
  roundEndsInSeconds: number;
}

export interface PackedRoundExecutionState {
  success: true;
  round: RoundExecutionState;
}

export interface PackedUserStats {
  success: true;
  stats: UserStats;
}

export interface PackedUserTokenStats {
  success: true;
  stats: UserTokenStats;
}

export interface PackedUserAssetStats {
  success: true;
  stats: UserAssetStats;
}

export interface PackedUserValidMintedAssetsStats {
  success: true;
  stats: UserValidMintedAssets;
}

export interface PackedDexOrdersStats {
  success: true;
  stats: DexOrder;
}
