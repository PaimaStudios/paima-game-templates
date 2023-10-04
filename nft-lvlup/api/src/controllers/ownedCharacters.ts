import { Controller, Get, Query, Route } from 'tsoa';
import { getUserCharacters, requirePool } from '@game/db';
import { getAllOwnedNfts } from '@paima/sdk/utils-backend';
import type { OwnedCharactersResponse } from '@game/utils';

@Route('owned_characters')
export class OwnedCharactersController extends Controller {
  @Get()
  public async get(@Query() wallet: string): Promise<OwnedCharactersResponse> {
    const pool = requirePool();
    wallet = wallet.toLowerCase();

    const nfts = await getAllOwnedNfts(pool, wallet);

    if (nfts.length === 0) {
      return { characters: [] };
    }

    const userCharacters = await getUserCharacters.run(
      { characters: nfts.map(nft => nft.tokenId.toString()) },
      pool
    );
    return { characters: userCharacters };
  }
}
