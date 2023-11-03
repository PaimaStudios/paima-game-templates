import type {
  IGetLobbyByIdResult,
  IGetUserStatsResult,
  IGetNewLobbiesByUserAndBlockHeightResult,
} from '@dice/db';
import type { IGetMatchMovesResult } from '@dice/db/build/select.queries';

// TODO: find this in lib.es5
export type PropertiesNonNullable<T> = { [P in keyof T]-?: NonNullable<T[P]> };

export enum RoundKind {
  initial,
  extra,
}
export type DiceRolls = {
  finalScore: number;
} & (
  | {
      roundKind: RoundKind.initial;
      dice: [number, number][];
    }
  | {
      roundKind: RoundKind.extra;
      dice: [[number]];
    }
);

export enum TickEventKind {
  roll,
  applyPoints,
  turnEnd,
  roundEnd,
  matchEnd,
}

export type RollTickEvent = {
  kind: TickEventKind.roll;
  diceRolls: [number] | [number, number];
  rollAgain: boolean;
};
export type ApplyPointsTickEvent = {
  kind: TickEventKind.applyPoints;
  points: number[];
};
export type TurnEndTickEvent = {
  kind: TickEventKind.turnEnd;
};
export type RoundEndTickEvent = {
  kind: TickEventKind.roundEnd;
};
export type MatchEndTickEvent = {
  kind: TickEventKind.matchEnd;
  result: MatchResult;
};

export type TickEvent =
  | RollTickEvent
  | ApplyPointsTickEvent
  | TurnEndTickEvent
  | RoundEndTickEvent
  | MatchEndTickEvent;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MatchEnvironment {
  practice: boolean;
  numberOfRounds: number;
}

export interface MatchState {
  players: LobbyPlayer[];
  // Round that is displayed to users (consists of everyone taking a turn).
  // Not to be confused with round everywhere else (1 move + 1 random seed).
  properRound: number;
  turn: number; // whose turn is it
  result: undefined | MatchResult;
}

export type LobbyStatus = 'open' | 'active' | 'finished' | 'closed';

// TODO: allow for more than 2 players
export type ConciseResult = 'w' | 't' | 'l';
export type ExpandedResult = 'win' | 'tie' | 'loss';

export type MatchResult = ConciseResult[];

export interface MatchWinnerResponse {
  match_status?: LobbyStatus;
  winner_nft_id?: undefined | number;
}

export interface RoundExecutorBackendData {
  lobby: IGetLobbyByIdResult;
  moves: IGetMatchMovesResult[];
  seed: string;
}

export interface RoundExecutorData extends RoundExecutorBackendData {
  matchState: MatchState;
}

interface ExecutorDataSeed {
  seed: string;
  block_height: number;
  round: number;
}

export interface MatchExecutorData {
  lobby: LobbyState;
  moves: IGetMatchMovesResult[];
  seeds: ExecutorDataSeed[];
}

export interface BaseRoundStatus {
  executed: boolean;
  usersWhoSubmittedMoves: number[];
}

export interface RoundStatusData extends BaseRoundStatus {
  roundStarted: number; // blockheight
  roundLength: number;
}

export type UserStats = IGetUserStatsResult;

export type NewLobby = IGetNewLobbiesByUserAndBlockHeightResult;

export type LobbyPlayer = {
  nftId: number;
  turn: undefined | number;
  points: number;
  score: number;
};

type LobbyStateProps = 'current_match' | 'current_round' | 'current_turn' | 'current_proper_round';
export type LobbyWithStateProps = Omit<IGetLobbyByIdResult, LobbyStateProps> &
  PropertiesNonNullable<Pick<IGetLobbyByIdResult, LobbyStateProps>>;

export interface LobbyState extends LobbyWithStateProps {
  roundSeed: string;
  players: LobbyPlayer[];
}
