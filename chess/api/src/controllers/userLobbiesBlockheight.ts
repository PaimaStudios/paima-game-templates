import { Controller, Get, Query, Route, ValidateError } from 'tsoa';
import { requirePool, getNewLobbiesByUserAndBlockHeight } from '@chess/db';
import { psqlNum } from '../validation.js';
import { isLeft } from 'fp-ts/Either';
import type { NewLobby } from '@chess/utils';

interface GetUserLobbiesBlockheightResponse {
  lobbies: NewLobby[];
}

@Route('user_lobbies_blockheight')
export class UserLobbiesBlockheightController extends Controller {
  @Get()
  public async get(@Query() wallet: string, @Query() blockHeight: number): Promise<GetUserLobbiesBlockheightResponse> {
    const pool = requirePool();
    const valBH = psqlNum.decode(blockHeight);
    if (isLeft(valBH)) {
      throw new ValidateError({ blockHeight: { message: 'invalid number' } }, '');
    }

    wallet = wallet.toLowerCase();
    const lobbies = await getNewLobbiesByUserAndBlockHeight.run(
      { wallet, block_height: blockHeight },
      pool
    );
    return { lobbies };
  }
}
