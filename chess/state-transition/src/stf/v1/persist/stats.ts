import type { IGetUserStatsResult, INewStatsParams, IUpdateStatsParams } from '@chess/db';
import { newStats, updateStats } from '@chess/db';
import type { SQLUpdate } from 'paima-sdk/paima-db';
import { createScheduledData } from 'paima-sdk/paima-db';
import type { WalletAddress } from 'paima-sdk/paima-utils';
import type { ConciseResult } from '@chess/utils';

// Generate blank/empty user stats
export function blankStats(wallet: string): SQLUpdate {
  const params: INewStatsParams = {
    stats: {
      wallet: wallet,
      wins: 0,
      ties: 0,
      losses: 0,
    },
  };
  return [newStats, params];
}

// Persist updating user stats in DB
export function persistStatsUpdate(
  user: WalletAddress,
  result: ConciseResult,
  stats: IGetUserStatsResult
): SQLUpdate {
  const userParams: IUpdateStatsParams = {
    stats: {
      wallet: user,
      wins: result === 'w' ? stats.wins + 1 : stats.wins,
      losses: result === 'l' ? stats.losses + 1 : stats.losses,
      ties: result === 't' ? stats.ties + 1 : stats.ties,
    },
  };
  return [updateStats, userParams];
}

// Schedule a stats update to be executed in the future
export function scheduleStatsUpdate(
  wallet: WalletAddress,
  result: ConciseResult,
  block_height: number
): SQLUpdate {
  return createScheduledData(createStatsUpdateInput(wallet, result), block_height);
}

// Create stats update input
function createStatsUpdateInput(wallet: WalletAddress, result: ConciseResult): string {
  return `u|*${wallet}|${result}`;
}
