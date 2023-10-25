import type { RoundExecutor } from '@paima/sdk/executors';
import { roundExecutor } from '@paima/sdk/executors';
import type Prando from '@paima/sdk/prando';
import type { MatchState, MatchEnvironment, TickEvent } from './types';
import { processTick } from './tick';

export * from './types';
export type * from './types';
export * from './tick';
const matchEnv = () => ({});
const matchState = () => ({});
export function initRoundExecutor(
  moves: [],
  randomnessGenerator: Prando
): RoundExecutor<MatchState, TickEvent> {
  return roundExecutor.initialize(
    matchEnv(),
    matchState(),
    moves,
    randomnessGenerator,
    processTick
  );
}

export function extractMatchEnvironment(): MatchEnvironment {
  return {};
}
