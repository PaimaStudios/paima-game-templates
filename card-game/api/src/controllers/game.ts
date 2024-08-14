import { Controller, Get, Response, Route } from 'tsoa';
import { requirePool, getCards } from '@game/db';
import type { IGetCardsResult } from '@game/db';
import { StatusCodes } from 'http-status-codes';
import type { InternalServerErrorResult, ValidateErrorResult } from '@paima/sdk/utils';

@Route('game')
export class GameController extends Controller {
  @Get('/')
  @Response<InternalServerErrorResult>(StatusCodes.INTERNAL_SERVER_ERROR)
  @Response<ValidateErrorResult>(StatusCodes.UNPROCESSABLE_ENTITY)
  public async getGame(): Promise<{ stats: IGetCardsResult[] }> {
    const pool = requirePool();
    const stats = await getCards.run(undefined, pool);
    if (!stats) throw new Error('not found');
    return { stats };
  }
}
