import { Controller, Get, Query, Route } from 'tsoa';
import { requirePool, getUserTokenStats } from '@game/db';
import type { UserTokenStats } from '@game/utils';

interface GetUserTokenStateResponse {
  stats: UserTokenStats[];
}

@Route('user_token_state')
export class UserTokenStateController extends Controller {
  @Get()
  public async get(
    @Query() wallet: string,
    @Query() userTokenId: number
  ): Promise<GetUserTokenStateResponse> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();
    const stats = await getUserTokenStats.run({ wallet, userTokenId }, pool);
    return { stats };
  }
}
