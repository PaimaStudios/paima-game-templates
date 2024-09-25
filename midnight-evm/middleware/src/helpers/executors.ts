import type { MatchExecutor, RoundExecutor } from '@paima/sdk/executors';
import { matchExecutor } from '@paima/sdk/executors';
import type { MatchState, TickEvent } from '@midnightevm/game-logic';
import { extractMatchEnvironment, initRoundExecutor, processTick } from '@midnightevm/game-logic';
import type { MatchExecutorData } from '@midnightevm/utils';

export function buildRoundExecutor(): RoundExecutor<MatchState, TickEvent> {
  return initRoundExecutor();
}

export function buildMatchExecutor({}: MatchExecutorData): MatchExecutor<MatchState, TickEvent> {
  return matchExecutor.initialize(
    extractMatchEnvironment(),
    null as any,
    null as any,
    null as any,
    null as any,
    processTick
  );
}
