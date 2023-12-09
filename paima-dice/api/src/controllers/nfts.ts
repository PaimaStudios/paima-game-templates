import { Controller, Get, Query, Route } from 'tsoa';
import { requirePool } from '@dice/db';
import { NFT_NAME } from '@dice/utils';
import { getOwnedNfts } from '@paima/node-sdk/utils-backend';

@Route('nfts')
export class LobbyNFTController extends Controller {
  @Get('wallet')
  public async getWalletNFTs(@Query() wallet: string): Promise<number[]> {
    const pool = requirePool();
    const ownedNft = await getOwnedNfts(pool, NFT_NAME, wallet);
    const ownedNftIds = ownedNft.map(id => Number(id));

    return ownedNftIds;
  }
}
