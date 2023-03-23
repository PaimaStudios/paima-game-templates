import type {
  IGetLobbyByIdResult,
  IGetMovesByLobbyResult,
  IGetUserStatsResult,
  IGetNewLobbiesByUserAndBlockHeightResult,
  IGetPaginatedUserLobbiesResult,
} from '@chess/db';
import type { WalletAddress } from 'paima-sdk/paima-utils';
import type { IGetBlockHeightResult } from 'paima-sdk/paima-db';

export type LobbyStatus = 'open' | 'active' | 'finished' | 'closed';
export type ConciseResult = 'w' | 't' | 'l';
export type ExpandedResult = 'win' | 'tie' | 'loss';
export type MatchResult = [ConciseResult, ConciseResult];

export interface MatchWinnerResponse {
  match_status?: LobbyStatus;
  winner_address?: string;
}

export interface RoundExecutorData {
  lobby: IGetLobbyByIdResult;
  match_state: string;
  moves: IGetMovesByLobbyResult[];
  block_height: IGetBlockHeightResult;
}

interface ExecutorDataSeed {
  seed: string;
  block_height: number;
  round: number;
}

export interface MatchExecutorData {
  lobby: IGetLobbyByIdResult;
  moves: IGetMovesByLobbyResult[];
  seeds: ExecutorDataSeed[];
}

export interface BaseRoundStatus {
  executed: boolean;
  usersWhoSubmittedMoves: WalletAddress[];
}

export interface RoundStatusData extends BaseRoundStatus {
  roundStarted: number; // blockheight
  roundLength: number;
}

export type UserStats = IGetUserStatsResult;

export type NewLobby = IGetNewLobbiesByUserAndBlockHeightResult;

export interface LobbyState extends LobbyStateQuery {
  round_ends_in_blocks: number;
  round_ends_in_secs: number;
}

export interface LobbyStateQuery extends IGetLobbyByIdResult {
  round_start_height: number;
}

export interface UserLobby extends IGetPaginatedUserLobbiesResult {
  myTurn?: boolean;
}
