import { Controller, Get, Query, Route } from 'tsoa';
import type { IGetUserCharactersResult } from '@game/db';
import { getUserCharacters, requirePool } from '@game/db';
import { getAllOwnedNfts } from 'paima-sdk/paima-utils-backend';
import { CHARACTERS_CDE } from '@game/utils';

interface Response {
  characters: IGetUserCharactersResult[];
}

@Route('owned_characters')
export class OwnedCharactersController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<Response> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();

    // TODO: extract cdeName elsewhere
    const characters = await getAllOwnedNfts(pool, CHARACTERS_CDE, wallet);

    if (characters.length === 0) {
      return { characters: [] };
    }

    const userCharacters = await getUserCharacters.run(
      { characters: characters.map(value => value.toString()) },
      pool
    );
    return { characters: userCharacters };
  }
}
