import { Controller, Get, Query, Route } from 'tsoa';
import {
  requirePool,
  getUserStats,
  getCards,
  IGetCardsResult,
} from '@game/db';

@Route('game')
export class GameController extends Controller {
  @Get('/')
  public async getGame(): Promise<{ stats: IGetCardsResult[] }> {
    const pool = requirePool();
    const stats = await getCards.run(undefined, pool);
    if (!stats) throw new Error('not found');
    return { stats };
  }

}
