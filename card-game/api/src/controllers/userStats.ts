import { Controller, Get, Query, Route, Response } from 'tsoa';
import { requirePool, getUserStats } from '@game/db';
import type { UserStats } from '@game/utils';
import type { InternalServerErrorResult, ValidateErrorResult } from '@paima/sdk/utils';
import { StatusCodes } from 'http-status-codes';

interface GetUserStatsResponse {
  stats: UserStats;
}

@Route('user_stats')
export class UserStatsController extends Controller {
  @Response<InternalServerErrorResult>(StatusCodes.INTERNAL_SERVER_ERROR)
  @Response<ValidateErrorResult>(StatusCodes.UNPROCESSABLE_ENTITY)
  @Get()
  public async get(@Query() wallet: string): Promise<GetUserStatsResponse> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();
    const [stats] = await getUserStats.run({ wallet }, pool);
    return { stats };
  }
}
