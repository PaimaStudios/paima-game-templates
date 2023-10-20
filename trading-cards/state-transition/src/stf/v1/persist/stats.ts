import type { IGetUserStatsResult, INewStatsParams, IUpdateStatsParams } from '@cards/db';
import { newStats, updateStats } from '@cards/db';
import type { SQLUpdate } from '@paima/sdk/db';
import { createScheduledData } from '@paima/sdk/db';
import { PARSER_PREFIXES, type ConciseResult, PARSER_KEYS } from '@cards/game-logic';

// Generate blank/empty user stats
export function blankStats(nftId: number): SQLUpdate {
  const params: INewStatsParams = {
    stats: {
      nft_id: nftId,
      wins: 0,
      ties: 0,
      losses: 0,
    },
  };
  return [newStats, params];
}

// Persist updating user stats in DB
export function persistStatsUpdate(
  nftId: number,
  result: ConciseResult,
  stats: IGetUserStatsResult
): SQLUpdate {
  const userParams: IUpdateStatsParams = {
    stats: {
      nft_id: nftId,
      wins: result === 'w' ? stats.wins + 1 : stats.wins,
      losses: result === 'l' ? stats.losses + 1 : stats.losses,
      ties: result === 't' ? stats.ties + 1 : stats.ties,
    },
  };
  return [updateStats, userParams];
}

// Schedule a stats update to be executed in the future
// Stats are updated with scheduled data to support parallelism safely.
export function scheduleStatsUpdate(
  nftId: number,
  result: ConciseResult,
  block_height: number
): SQLUpdate {
  return createScheduledData(createStatsUpdateInput(nftId, result), block_height);
}

// Create stats update input
function createStatsUpdateInput(nftId: number, result: ConciseResult): string {
  return `${PARSER_PREFIXES[PARSER_KEYS.userScheduledData]}|*${nftId.toString(10)}|${result}`;
}
