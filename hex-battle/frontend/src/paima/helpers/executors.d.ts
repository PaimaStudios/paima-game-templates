import type { RoundExecutor } from '@paima/sdk/executors';
import type { MatchState, TickEvent } from '@hexbattle/game-logic';
import type { RoundExecutorData } from '@hexbattle/utils';
export declare function buildRoundExecutor(data: RoundExecutorData, round: number): RoundExecutor<MatchState, TickEvent>;
