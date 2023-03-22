import type { MatchExecutor, RoundExecutor } from 'paima-sdk/paima-executors';
import type { MatchExecutorData, RoundExecutorData } from '@chess/utils';
export declare function buildRoundExecutor(data: RoundExecutorData): RoundExecutor;
export declare function buildMatchExecutor({ lobby, moves, seeds }: MatchExecutorData): MatchExecutor;
