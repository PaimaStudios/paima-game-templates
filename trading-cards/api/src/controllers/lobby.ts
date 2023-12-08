import { Controller, Get, Query, Route } from 'tsoa';
import { getLobbyById, getLobbyPlayers, requirePool } from '@cards/db';
import type {
  ApiResult,
  LobbyPlayer,
  LobbyStateResponse,
  OpenLobbiesResponse,
  RandomActiveLobbyResponse,
  SearchOpenLobbiesResponse,
  UserLobbiesBlockHeightResponse,
} from '@cards/game-logic';
import {
  deserializeBoardCard,
  deserializeHandCard,
  deserializeMove,
  isLobbyWithStateProps,
  MiddlewareErrorCode,
  type LobbyRawResponse,
} from '@cards/game-logic';
import {
  getMatch,
  getNewLobbiesByUserAndBlockHeight,
  getOpenLobbyById,
  getPaginatedOpenLobbies,
  getPaginatedUserLobbies,
  getRandomActiveLobby,
  getRound,
  searchPaginatedOpenLobbies,
} from '@cards/db/src/select.queries';
import { getBlockHeights } from '@paima/node-sdk/db';
import { isLeft } from 'fp-ts/lib/Either';
import { psqlNum } from '../validation';

const MIN_SEARCH_LENGTH = 3;
const LOBBY_ID_LENGTH = 12;

@Route('lobby')
export class LobbyController extends Controller {
  @Get('raw')
  public async raw(@Query() lobbyID: string): Promise<ApiResult<LobbyRawResponse>> {
    const pool = requirePool();
    const [lobby] = await getLobbyById.run({ lobby_id: lobbyID }, pool);
    return { success: true, result: { lobby } };
  }

  @Get('state')
  public async state(@Query() lobbyID: string): Promise<ApiResult<LobbyStateResponse>> {
    const pool = requirePool();
    const [[lobby], rawPlayers] = await Promise.all([
      getLobbyById.run({ lobby_id: lobbyID }, pool),
      getLobbyPlayers.run({ lobby_id: lobbyID }, pool),
    ]);
    if (!lobby) return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };

    if (!isLobbyWithStateProps(lobby))
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };

    const [match] = await getMatch.run(
      {
        lobby_id: lobbyID,
        match_within_lobby: lobby.current_match,
      },
      pool
    );

    const [last_round_data] =
      lobby.current_round === 0
        ? [undefined]
        : await getRound.run(
            {
              lobby_id: lobbyID,
              match_within_lobby: lobby.current_match,
              round_within_match: lobby.current_round - 1,
            },
            pool
          );

    const seedBlockHeight =
      lobby.current_round === 0
        ? match.starting_block_height
        : last_round_data?.execution_block_height;

    if (seedBlockHeight == null) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }
    const [seedBlockRow] = await getBlockHeights.run({ block_heights: [seedBlockHeight] }, pool);
    const roundSeed = seedBlockRow.seed;

    const players: LobbyPlayer[] = rawPlayers.map(raw => ({
      nftId: raw.nft_id,
      hitPoints: raw.hit_points,
      startingCommitments: raw.starting_commitments,
      currentDeck: raw.current_deck,
      currentHand: raw.current_hand.map(deserializeHandCard),
      currentBoard: raw.current_board.map(deserializeBoardCard),
      currentDraw: raw.current_draw,
      currentResult: raw.current_result ?? undefined,
      botLocalDeck: undefined,
      turn: raw.turn ?? undefined,
    }));

    const txEventMove =
      lobby.current_tx_event_move == null
        ? undefined
        : deserializeMove(lobby.current_tx_event_move);

    return {
      success: true,
      result: {
        lobby: {
          ...lobby,
          roundSeed,
          players,
          txEventMove,
        },
      },
    };
  }

  @Get('user')
  public async user(
    @Query() nftId: number,
    @Query() count?: number,
    @Query() page?: number
  ): Promise<ApiResult<OpenLobbiesResponse>> {
    const pool = requirePool();
    const valPage = psqlNum.decode(page || 1);
    const valCount = psqlNum.decode(count || 10);
    if (isLeft(valPage)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    } else if (isLeft(valCount)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    } else {
      const p = valPage.right;
      const c = valCount.right;
      const offset = (p - 1) * c;
      const lobbies = await getPaginatedUserLobbies.run(
        { count: `${c}`, page: `${offset}`, nft_id: nftId },
        pool
      );

      return { success: true, result: { lobbies } };
    }
  }

  @Get('open')
  public async open(
    @Query() nftId: number,
    @Query() count?: number,
    @Query() page?: number
  ): Promise<ApiResult<OpenLobbiesResponse>> {
    const pool = requirePool();
    const valPage = psqlNum.decode(page || 1);
    const valCount = psqlNum.decode(count || 10);
    if (isLeft(valPage)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    } else if (isLeft(valCount)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    } else {
      const p = valPage.right;
      const c = valCount.right;
      const offset = (p - 1) * c;
      const lobbies = await getPaginatedOpenLobbies.run(
        { count: `${c}`, page: `${offset}`, nft_id: nftId },
        pool
      );

      return { success: true, result: { lobbies } };
    }
  }

  @Get('randomActive')
  public async randomActive(): Promise<ApiResult<RandomActiveLobbyResponse>> {
    const pool = requirePool();
    const [lobby] = await getRandomActiveLobby.run(undefined, pool);
    const result = lobby || null;
    return { success: true, result: { lobby: result } };
  }

  @Get('searchOpen')
  public async searchOpen(
    @Query() nftId: number,
    @Query() searchQuery: string,
    @Query() page?: number,
    @Query() count?: number
  ): Promise<ApiResult<SearchOpenLobbiesResponse>> {
    const pool = requirePool();
    if (searchQuery.length < MIN_SEARCH_LENGTH || searchQuery.length > LOBBY_ID_LENGTH)
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };

    if (searchQuery.length == LOBBY_ID_LENGTH) {
      const lobbies = await getOpenLobbyById.run({ searchQuery, nft_id: nftId }, pool);
      return { success: true, result: { lobbies } };
    }

    const valPage = psqlNum.decode(page || 1);
    const valCount = psqlNum.decode(count || 10);
    if (isLeft(valPage)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }

    if (isLeft(valCount)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }

    const c = valCount.right;
    const offset = (valPage.right - 1) * c;
    const lobbies = await searchPaginatedOpenLobbies.run(
      { count: `${c}`, page: `${offset}`, searchQuery: `%${searchQuery}%`, nft_id: nftId },
      pool
    );
    return { success: true, result: { lobbies } };
  }

  @Get('userBlockHeight')
  public async userBlockHeight(
    @Query() nftId: number,
    @Query() blockHeight: number
  ): Promise<ApiResult<UserLobbiesBlockHeightResponse>> {
    const pool = requirePool();
    const valBH = psqlNum.decode(blockHeight);
    if (isLeft(valBH)) {
      return { success: false, errorCode: MiddlewareErrorCode.GENERIC_ERROR };
    }

    const lobbies = await getNewLobbiesByUserAndBlockHeight.run(
      { nft_id: nftId, block_height: blockHeight },
      pool
    );
    return { success: true, result: { lobbies } };
  }
}
