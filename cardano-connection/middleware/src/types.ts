import type { RoundExecutor, MatchExecutor } from '@paima/sdk/executors';
import type { Hash } from '@paima/sdk/utils';

import type {
  BaseRoundStatus,
  UserStats,
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
