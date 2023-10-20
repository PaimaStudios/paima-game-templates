import type { IGetLobbyByIdResult } from '@cards/db';
import type { IGetMatchMovesResult } from '@cards/db/build/select.queries';
import type { LobbyPlayer, LobbyState, Move } from '.';

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
  // Move that required a tx submission. It it was for new randomness,
  // we'll want to provide new randomness in postTx event (e.g. decide to draw a card).
  txEventMove: undefined | Move;
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
