import { Controller, Get, Query, Route } from 'tsoa';
import { requirePool, getUserValidMintedAssets } from '@game/db';
import type { UserValidMintedAssets } from '@game/utils';

interface GetUserValidMintedAssetsResponse {
  stats: UserValidMintedAssets[];
}

@Route('user_valid_minted_assets')
export class UserValidMintedAssetsController extends Controller {
  @Get()
  public async get(@Query() user: string): Promise<GetUserValidMintedAssetsResponse> {
    const pool = requirePool();
    user = user.toLowerCase();
    const stats = await getUserValidMintedAssets.run({ user }, pool);
    return { stats };
  }
}
