import { PARSER_KEYS, PARSER_PREFIXES } from '@cards/game-logic';
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
  return `${
    PARSER_PREFIXES[PARSER_KEYS.practiceMoves]
  }|*${lobbyId}|${matchWithinLobby}|${roundWithinMatch}`;
}
