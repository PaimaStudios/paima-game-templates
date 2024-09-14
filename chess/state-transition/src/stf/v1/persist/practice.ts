import type { SQLUpdate } from '@paima/node-sdk/db';
import { createScheduledData } from '@paima/node-sdk/db';
import { precompiles } from '@chess/precompiles';

// Schedule a practice move update to be executed in the future
export function schedulePracticeMove(
  lobbyId: string,
  round: number,
  block_height: number
): SQLUpdate {
  return createScheduledData(
    createPracticeInput(lobbyId, round),
    { blockHeight: block_height },
    { precompile: precompiles.default }
  );
}

function createPracticeInput(lobbyId: string, round: number) {
  return `sb|*${lobbyId}|${round}`;
}
