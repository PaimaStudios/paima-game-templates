import type { IGetUserStatsResult, INewStatsParams, IUpdateStatsParams } from '@chess/db';
import { newStats, updateStats } from '@chess/db';
import type { SQLUpdate } from '@paima/node-sdk/db';
import { createScheduledData } from '@paima/node-sdk/db';
import type { WalletAddress } from '@paima/sdk/utils';
import type { ConciseResult } from '@chess/utils';
import type { UserStats } from '../types';

// Generate blank/empty user stats
export function blankStats(wallet: string): SQLUpdate {
  const params: INewStatsParams = {
    stats: {
      wallet: wallet,
      wins: 0,
      ties: 0,
      losses: 0,
      rating: 0,
    },
  };
  return [newStats, params];
}

// Persist updating user stats in DB
export function persistStatsUpdate(newStats: UserStats, oldStats: IGetUserStatsResult): SQLUpdate {
  const { user, result, ratingChange } = newStats;
  const userParams: IUpdateStatsParams = {
    stats: {
      wallet: user,
      wins: result === 'w' ? oldStats.wins + 1 : oldStats.wins,
      losses: result === 'l' ? oldStats.losses + 1 : oldStats.losses,
      ties: result === 't' ? oldStats.ties + 1 : oldStats.ties,
      rating: oldStats.rating + ratingChange,
    },
  };
  return [updateStats, userParams];
}

// Schedule a stats update to be executed in the future
export function scheduleStatsUpdate(
  wallet: WalletAddress,
  result: ConciseResult,
  ratingChange: number,
  block_height: number
): SQLUpdate {
  return createScheduledData(createStatsUpdateInput(wallet, result, ratingChange), block_height);
}

// Create stats update input
function createStatsUpdateInput(
  wallet: WalletAddress,
  result: ConciseResult,
  ratingChange: number
): string {
  return `u|*${wallet}|${result}|${ratingChange}`;
}
