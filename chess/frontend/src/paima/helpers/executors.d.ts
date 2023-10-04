import type { MatchExecutor, RoundExecutor } from '@paima/sdk/executors';
import type { MatchState, TickEvent } from '@chess/game-logic';
import type { MatchExecutorData, RoundExecutorData } from '@chess/utils';
export declare function buildRoundExecutor(data: RoundExecutorData, round: number): RoundExecutor<MatchState, TickEvent>;
export declare function buildMatchExecutor({ lobby, moves, seeds, }: MatchExecutorData): MatchExecutor<MatchState, TickEvent>;
