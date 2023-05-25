import { Controller, Get, Query, Route } from 'tsoa';
import { getUserCharacters, requirePool } from '@game/db';
import { getAllOwnedNfts } from 'paima-sdk/paima-utils-backend';
import type { OwnedCharactersResponse } from '@game/utils';
import { CHARACTERS_CDE } from '@game/utils';

@Route('owned_characters')
export class OwnedCharactersController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<OwnedCharactersResponse> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();

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
