import type {
  IGetLobbyByIdResult,
  IGetPaginatedOpenLobbiesResult,
  IGetRandomActiveLobbyResult,
} from '@cards/db';
import type {
  LobbyState,
  MatchExecutorData,
  NewLobby,
  RoundExecutorBackendData,
  UserStats,
} from '.';
import type {
  IGetOwnedCardsResult,
  IGetBoughtPacksResult,
  IGetTradeNftsResult,
  IGetCardsByIdsResult,
  IGetAllPaginatedUserLobbiesResult,
} from '@cards/db/build/select.queries';
import type { FailedResult, SuccessfulResult } from '@paima/sdk/mw-core';

export type ApiResult<T> = SuccessfulResult<T> | Omit<FailedResult, 'errorMessage'>;

export type LobbyRawResponse = {
  lobby: IGetLobbyByIdResult | null;
};

export type LobbyStateResponse = {
  // returns null if missing state properties, use lobbyRaw for any lobby
  lobby: LobbyState | null;
};

export type MatchExecutorResponse = MatchExecutorData | null;

export type AccountNftResponse = {
  nft: undefined | number;
};

export type OpenLobbiesResponse = {
  lobbies: IGetPaginatedOpenLobbiesResult[];
};

export type RandomActiveLobbyResponse = {
  lobby: IGetRandomActiveLobbyResult | null;
};

export type RoundExecutorResponse =
  | RoundExecutorBackendData
  | {
      error:
        | 'lobby not found'
        | 'bad round number'
        | 'round not found'
        | 'match not found'
        | 'internal error';
    };

export type SearchOpenLobbiesResponse = {
  lobbies: IGetLobbyByIdResult[];
};

export type GetCardsResponse = {
  cards: IGetOwnedCardsResult[];
};

export type GetPacksResponse = {
  packs: IGetBoughtPacksResult[];
};

export type GetTradeNftsResponse = {
  tradeNfts: IGetTradeNftsResult[];
  cardLookup: Record<string, IGetCardsByIdsResult>;
};

export type UserLobbiesResponse = {
  lobbies: IGetAllPaginatedUserLobbiesResult[];
};

export type UserLobbiesBlockHeightResponse = {
  lobbies: NewLobby[];
};

export type UserStatsResponse = {
  stats: UserStats;
};
