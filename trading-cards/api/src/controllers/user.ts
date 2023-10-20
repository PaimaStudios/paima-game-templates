import { Controller, Get, Query, Route } from 'tsoa';
import { getOwnedNft, requirePool } from '@cards/db';
import { isLeft } from 'fp-ts/Either';
import { psqlInt } from '../validation.js';
import {
  getBoughtPacks,
  getCardsByIds,
  getOwnedCards,
  getTradeNfts,
  getUserStats,
} from '@cards/db/src/select.queries.js';
import { getNftOwner, getOwnedNfts } from '@paima/sdk/utils-backend';
import { NFT_NAME, CARD_TRADE_NFT_NAME } from '@cards/utils';
import type { AccountNftResponse, ApiResult, UserStatsResponse } from '@cards/game-logic';
import {
  MiddlewareErrorCode,
  type GetCardsResponse,
  type GetPacksResponse,
  type GetTradeNftsResponse,
} from '@cards/game-logic';

@Route('user')
export class UserController extends Controller {
  @Get('accountNft')
  public async getWalletNFT(@Query() wallet: string): Promise<ApiResult<AccountNftResponse>> {
    const pool = requirePool();
    const nft = await getOwnedNft(pool, NFT_NAME, wallet);
    return { success: true, result: { nft } };
  }

  @Get('cards')
  public async getCards(@Query() nftId: number): Promise<ApiResult<GetCardsResponse>> {
    const dbConn = requirePool();
    const valNftId = psqlInt.decode(nftId);
    if (isLeft(valNftId)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }
    const cards = await getOwnedCards.run({ owner_nft_id: nftId }, dbConn);

    return { success: true, result: { cards } };
  }

  @Get('packs')
  public async getPacks(@Query() nftId: number): Promise<ApiResult<GetPacksResponse>> {
    const dbConn = requirePool();
    const valNftId = psqlInt.decode(nftId);
    if (isLeft(valNftId)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }
    const packs = await getBoughtPacks.run({ buyer_nft_id: nftId }, dbConn);

    return { success: true, result: { packs } };
  }

  @Get('tradeNfts')
  public async getTradeNfts(@Query() nftId: number): Promise<ApiResult<GetTradeNftsResponse>> {
    const dbConn = requirePool();
    const valNftId = psqlInt.decode(nftId);
    if (isLeft(valNftId)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }

    const ownerAddress = await getNftOwner(dbConn, NFT_NAME, BigInt(nftId));
    if (ownerAddress == null) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }

    const tradeNftIds = await getOwnedNfts(dbConn, CARD_TRADE_NFT_NAME, ownerAddress);
    const tradeNfts =
      tradeNftIds.length === 0
        ? []
        : await getTradeNfts.run({ nft_ids: tradeNftIds.map(nft => Number(nft)) }, dbConn);
    const cardIds = tradeNfts.flatMap(tradeNft => tradeNft.cards ?? []);
    const cards = cardIds.length === 0 ? [] : await getCardsByIds.run({ ids: cardIds }, dbConn);
    const cardLookup = Object.fromEntries(cards.map(card => [card.id, card]));

    return { success: true, result: { tradeNfts, cardLookup } };
  }

  @Get('stats')
  public async stats(@Query() nftId: number): Promise<ApiResult<UserStatsResponse>> {
    const pool = requirePool();
    const [stats] = await getUserStats.run({ nft_id: nftId }, pool);
    return { success: true, result: { stats } };
  }
}
