import { Controller, Get, Query, Route } from 'tsoa';
import { requirePool, getUserAssetStats } from '@game/db';
import type { UserAssetStats } from '@game/utils';

interface GetUserAssetStateResponse {
  stats: UserAssetStats[];
}

@Route('user_asset_state')
export class UserAssetStateController extends Controller {
  @Get()
  public async get(
    @Query() user: string,
    @Query() userTokenId: number
  ): Promise<GetUserAssetStateResponse> {
    const pool = requirePool();
    user = user.toLowerCase();
    const stats = await getUserAssetStats.run({ user, userTokenId }, pool);
    return { stats };
  }
}
