import type { SQLUpdate } from 'paima-sdk/paima-db';
import type { RPSActions, ShortNotationGameResult } from '@game/game-logic';
export type { SQLUpdate };

export type ParsedSubmittedInput =
  | CreatedLobbyInput
  | JoinedLobbyInput
  | ClosedLobbyInput
  | SubmittedMovesInput
  | ScheduledDataInput
  | InvalidInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface CreatedLobbyInput {
  input: 'createdLobby';
  numOfRounds: number;
  roundLength: number;
  isHidden: boolean;
  isPractice: boolean;
}

export interface JoinedLobbyInput {
  input: 'joinedLobby';
  lobbyID: string;
}

export interface ClosedLobbyInput {
  input: 'closedLobby';
  lobbyID: string;
}

export interface SubmittedMovesInput {
  input: 'submittedMoves';
  lobbyID: string;
  roundNumber: number;
  move_rps: RPSActions;
}

export interface ScheduledDataInput {
  input: 'scheduledData';
  effect: SideEffect;
}

type SideEffect = ZombieRoundEffect | UserStatsEffect;

export interface ZombieRoundEffect {
  type: 'zombie';
  lobbyID: string;
}

export interface UserStatsEffect {
  type: 'stats';
  user: WalletAddress;
  result: ShortNotationGameResult;
}

export type WalletAddress = string;
export type GameInput = 'createdLobby' | 'joinedLobby' | 'submittedMove';

export interface UserStats {
  wins: number;
  ties: number;
  losses: number;
}

export interface RoundData {
  matchID: string;
  round: number;
  finalRound: number;
  blockHeight: number;
  states: RoundUserStates;
  // pendingMoves: IGetCachedMovesResult[];
}

export interface RoundUserStates {
  [key: WalletAddress]: RoundUserState;
}

export interface RoundUserState {
  wallet: WalletAddress;
  stats: UserStats;
  position: number;
}

export interface JsonState {
  openLobbies: JsonOpenLobbies;
  activeMatches: JsonActiveMatches;
}

export interface JsonOpenLobbies {
  [key: string]: LobbyData;
}

export interface LobbyData {
  created_at: Date;
  rounds: number;
  hidden: boolean;
  lobbyCreator: WalletAddress;
}

export interface JsonActiveMatches {
  [key: string]: RoundData;
}
