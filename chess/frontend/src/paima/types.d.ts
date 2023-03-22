import type { WalletAddress } from "paima-sdk/paima-utils";

/* DB TYPES */
export interface IGetBlockDataResult {
  block_height: number;
  done: boolean;
  seed: string;
}

export interface IGetLobbyByIdResult {
  created_at: Date;
  creation_block_height: number;
  current_round: number;
  hidden: boolean;
  latest_match_state: string;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: LobbyStatus;
  num_of_rounds: number;
  play_time_per_player: number;
  player_one_iswhite: boolean;
  player_two: string | null;
  practice: boolean;
  round_length: number;
}

export interface IGetMovesByLobbyResult {
  id: number;
  lobby_id: string;
  move_pgn: string;
  round: number;
  wallet: string;
}

export interface IGetUserStatsResult {
  losses: number;
  ties: number;
  wallet: string;
  wins: number;
}

export interface IGetNewLobbiesByUserAndBlockHeightResult {
  lobby_id: string;
}

export interface IGetPaginatedUserLobbiesResult {
  created_at: Date;
  creation_block_height: number;
  current_round: number;
  hidden: boolean;
  latest_match_state: string;
  lobby_creator: string;
  lobby_id: string;
  lobby_state: LobbyStatus;
  num_of_rounds: number;
  play_time_per_player: number;
  player_one_iswhite: boolean;
  player_two: string | null;
  practice: boolean;
  round_length: number;
}
/* DB TYPES */

export interface FailedResult {
  success: false;
  errorMessage: string;
  errorCode: number;
}

export interface SuccessfulResultMessage {
  success: true;
  message: string;
}
export type OldResult = SuccessfulResultMessage | FailedResult;

export type LobbyStatus = "open" | "active" | "finished" | "closed";
export type ConciseResult = "w" | "t" | "l";
export type ExpandedResult = "win" | "tie" | "loss";
export type MatchResult = [ConciseResult, ConciseResult];
export interface MatchWinnerResponse {
  match_status?: LobbyStatus;
  winner_address?: string;
}
export interface RoundExecutorData {
  lobby: IGetLobbyByIdResult;
  moves: IGetMovesByLobbyResult[];
  block_data: IGetBlockDataResult;
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
  roundStarted: number;
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

export type MatchExecutor<MatchState = any, TickEvent = any> = {
  currentRound: number;
  currentState: MatchState;
  roundExecutor: null | {
    currentTick: number;
    currentState: MatchState;
    tick: () => TickEvent[] | null;
    endState: () => MatchState;
  };
  __nextRound: () => void;
  tick: () => TickEvent[] | NewRoundEvent[] | null;
};

export interface MatchState {
  fenBoard: string;
}

export interface TickEvent {
  user: string;
  pgn_move: string;
}

export {};
