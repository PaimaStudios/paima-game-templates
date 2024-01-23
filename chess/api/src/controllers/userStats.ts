import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import { requirePool, getUserStats, getUserRatingPosition } from '@chess/db';
import type { UserStats } from '@chess/utils';

interface GetUserStatsResponse {
  stats: UserStats;
  rank?: string;
}

@Route('user_stats')
export class UserStatsController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<GetUserStatsResponse> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();
    const [stats] = await getUserStats.run({ wallet }, pool);
    if (!stats) {
      return { stats };
    }
    const [ratingPosition] = await getUserRatingPosition.run({ rating: stats.rating }, pool);
    return { stats, rank: ratingPosition.rank ?? undefined };
  }
}
