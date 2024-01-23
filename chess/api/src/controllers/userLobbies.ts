import { Controller, Get, Query, Route, ValidateError } from 'tsoa';
import { requirePool } from '@chess/db';
import { isLeft } from 'fp-ts/Either';
import { psqlNum } from '../validation.js';
import { getAllPaginatedUserLobbies } from '@chess/db';
import type { IGetAllPaginatedUserLobbiesResult } from '@chess/db';

interface GetUserLobbiesResponse {
  lobbies: IGetAllPaginatedUserLobbiesResult[];
}

@Route('user_lobbies')
export class UserLobbiesController extends Controller {
  @Get()
  public async get(
    @Query() wallet: string,
    @Query() count?: number,
    @Query() page?: number
  ): Promise<GetUserLobbiesResponse> {
    const pool = requirePool();
    const valPage = psqlNum.decode(page || 1); // pass 1 if undefined (or 0)
    const valCount = psqlNum.decode(count || 10); // pass 10 if undefined (or 0)
    // io-ts output typecheck. isLeft() is invalid, isRight() is valid
    // we'll reuse TSOA's error handling logic to throw an error
    if (isLeft(valPage)) {
      throw new ValidateError({ page: { message: 'invalid number' } }, '');
    }
    if (isLeft(valCount)) {
      throw new ValidateError({ count: { message: 'invalid number' } }, '');
    }

    wallet = wallet.toLowerCase();
    // after typecheck, valid data output is given in .right
    const p = valPage.right;
    const c = valCount.right;
    const offset = (p - 1) * c;
    const userLobbies = await getAllPaginatedUserLobbies.run(
      { wallet: wallet, count: `${c}`, page: `${offset}` },
      pool
    );
    return { lobbies: userLobbies };
  }
}
