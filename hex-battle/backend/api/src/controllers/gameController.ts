import type { IGetMovesForRoundResult } from '@hexbattle/db';
import { getGameState, getMovesForRound, requirePool } from '@hexbattle/db';
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
  @Get('/is_game_over')
  public async isGameOver(
    @Query() lobby_id: string
  ): Promise<{ isGameOver: boolean; current_round: number }> {
    const pool = requirePool();
    const [lobby] = await getGameState.run({ lobby_id }, pool);
    if (!lobby) throw new Error('Lobby does not exist');

    const isGameOver = lobby.lobby_state === 'closed' || lobby.lobby_state === 'finished';
    return { isGameOver, current_round: lobby.current_round };
  }
}
