import type { MatchExecutor, RoundExecutor } from '@paima/sdk/executors';
import { matchExecutor } from '@paima/sdk/executors';
import Prando from '@paima/sdk/prando';

import type { MatchState, TickEvent } from '@game/game-logic';
import { extractMatchEnvironment, initRoundExecutor, processTick } from '@game/game-logic';
import type { MatchExecutorData, RoundExecutorData } from '@game/utils';

export function buildRoundExecutor(
  data: RoundExecutorData,
  round: number
): RoundExecutor<MatchState, TickEvent> {
  const { seed } = data.block_data;
  console.log(seed, 'seed used for the round executor at the middleware');
  const randomnessGenerator = new Prando(seed);
  return initRoundExecutor(null, randomnessGenerator);
}

export function buildMatchExecutor({
  seeds,
}: MatchExecutorData): MatchExecutor<MatchState, TickEvent> {
  console.log(seeds, 'seeds used for the match executor at the middleware');

  const matchState: MatchState = {};
  return matchExecutor.initialize(extractMatchEnvironment(), 0, matchState, seeds, [], processTick);
}
