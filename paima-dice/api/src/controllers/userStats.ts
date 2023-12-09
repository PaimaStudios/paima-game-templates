import { Controller, Get, Query, Route } from 'tsoa';
import { requirePool, getUserStats } from '@dice/db';
import type { UserStats } from '@dice/utils';

interface Response {
  stats: UserStats;
}

@Route('user_stats')
export class UserStatsController extends Controller {
  @Get()
  public async get(@Query() nftId: number): Promise<Response> {
    const pool = requirePool();
    const [stats] = await getUserStats.run({ nft_id: nftId }, pool);
    return { stats };
  }
}
