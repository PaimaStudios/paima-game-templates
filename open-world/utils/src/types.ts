import type {
  IGetBlockDataResult,
  // IGetLobbyByIdResult,
  // IGetMovesByLobbyResult,
  IGetUserStatsResult,
  // IGetNewLobbiesByUserAndBlockHeightResult,
  // IGetPaginatedUserLobbiesResult,
  IGetWorldStatsResult,
} from '@game/db';
import type { WalletAddress } from 'paima-sdk/paima-utils';

export interface RoundExecutorData {
  match_state: string;
  // moves: IGetMovesByLobbyResult[];
  block_data: IGetBlockDataResult;
}

interface ExecutorDataSeed {
  seed: string;
  block_height: number;
  round: number;
}

export interface MatchExecutorData {
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

export type WorldStats = IGetWorldStatsResult;
