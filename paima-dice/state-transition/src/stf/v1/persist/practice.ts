import type { SQLUpdate } from '@paima/sdk/db';
import { createScheduledData } from '@paima/sdk/db';

// Schedule a practice move update to be executed in the future
export function schedulePracticeMove(
  lobbyId: string,
  matchWithinLobby: number,
  roundWithinMatch: number,
  block_height: number
): SQLUpdate {
  return createScheduledData(
    createPracticeInput(lobbyId, matchWithinLobby, roundWithinMatch),
    block_height
  );
}

function createPracticeInput(lobbyId: string, matchWithinLobby: number, roundWithinMatch: number) {
  return `p|*${lobbyId}|${matchWithinLobby}|${roundWithinMatch}`;
}
