import type { SQLUpdate } from '@paima/node-sdk/db';
import { createScheduledData } from '@paima/node-sdk/db';

// Schedule a practice move update to be executed in the future
export function schedulePracticeMove(
  lobbyId: string,
  round: number,
  move: string,
  block_height: number
): SQLUpdate {
  return createScheduledData(createPracticeInput(lobbyId, round, move), block_height);
}

function createPracticeInput(lobbyId: string, round: number, move: string) {
  return `s|*${lobbyId}|${round}|${move}`;
}
