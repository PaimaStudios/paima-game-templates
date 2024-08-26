import { Controller, Get, Query, Route } from 'tsoa';
import type { IGetGameByIdResult } from '@game/db';
import {
  requirePool,
  getUserStats,
  getQuestionAnswer,
  getGameById,
  getWorldStats,
  getNewGame,
} from '@game/db';

@Route('game')
export class GameController extends Controller {
  @Get('/round')
  public async getRound(
    @Query() game_id: string,
    @Query() stage: string
  ): Promise<{ stats: { response: string | null } }> {
    const id = parseInt(game_id, 10);
    if (isNaN(id)) throw new Error('invalid game id');
    const pool = requirePool();
    const [stats] = await getQuestionAnswer.run({ game_id: id, stage }, pool);
    if (!stats) throw new Error('not found');
    return { stats: { response: stats.answer } };
  }

  @Get('/')
  public async getGame(@Query() game_id: string): Promise<{ stats: IGetGameByIdResult }> {
    const id = parseInt(game_id, 10);
    if (isNaN(id)) throw new Error('invalid game id');
    const pool = requirePool();
    const [stats] = await getGameById.run({ id }, pool);
    if (!stats) throw new Error('not found');
    return { stats };
  }

  @Get('/new')
  public async getNewGameX(@Query() wallet: string): Promise<{ stats: IGetGameByIdResult }> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();
    const [stats] = await getNewGame.run({ wallet }, pool);
    if (!stats) throw new Error('not found');
    return { stats };
  }

  @Get('/tokens')
  public async getTokens(
    @Query() wallet: string
  ): Promise<{ stats: { tokens: number; global: number } }> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();
    const [stats] = await getUserStats.run({ wallet }, pool);
    if (!stats) throw new Error('not found');
    const [world] = await getWorldStats.run(undefined, pool);
    if (!world) throw new Error('not found 2');
    return { stats: { tokens: stats.tokens, global: world.tokens } };
  }
}
