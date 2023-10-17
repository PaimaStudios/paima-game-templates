import type { RoundExecutor } from '@paima/sdk/executors';
import Prando from '@paima/sdk/prando';

import type { MatchState, TickEvent } from '@hexbattle/game-logic';
import { initRoundExecutor } from '@hexbattle/game-logic';
import type { RoundExecutorData } from '@hexbattle/utils';

export function buildRoundExecutor(
  data: RoundExecutorData,
  round: number
): RoundExecutor<MatchState, TickEvent> {
  const { seed } = data.block_height;
  const randomnessGenerator = new Prando(seed);
  return initRoundExecutor([], randomnessGenerator);
}
