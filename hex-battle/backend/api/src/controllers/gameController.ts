import type { IGetMovesForRoundResult } from '@hexbattle/db';
import { getMovesForRound, requirePool } from '@hexbattle/db';
import { Controller, Get, Query, Route } from 'tsoa';

@Route('game')
export class GameController extends Controller {
  @Get('/move')
  public async getMoveForRound(
    @Query() lobby_id: string,
    @Query() round: number
  ): Promise<{
    move: IGetMovesForRoundResult;
  }> {
    const pool = requirePool();
    const [move] = await getMovesForRound.run(
      {
        lobby_id,
        round,
      },
      pool
    );
    return { move };
  }
}
