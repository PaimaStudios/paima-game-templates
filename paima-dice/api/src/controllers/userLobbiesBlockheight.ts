import { Controller, Get, Query, Route, ValidateError } from 'tsoa';
import { requirePool, getNewLobbiesByUserAndBlockHeight } from '@dice/db';
import { psqlNum } from '../validation.js';
import { isLeft } from 'fp-ts/Either';
import type { NewLobby } from '@dice/utils';

interface Response {
  lobbies: NewLobby[];
}

@Route('user_lobbies_blockheight')
export class UserLobbiesBlockheightController extends Controller {
  @Get()
  public async get(@Query() nftId: number, @Query() blockHeight: number): Promise<Response> {
    const pool = requirePool();
    const valBH = psqlNum.decode(blockHeight);
    if (isLeft(valBH)) {
      throw new ValidateError({ blockHeight: { message: 'invalid number' } }, '');
    }

    const lobbies = await getNewLobbiesByUserAndBlockHeight.run(
      { nft_id: nftId, block_height: blockHeight },
      pool
    );
    return { lobbies };
  }
}
