// import type { ConciseResult } from '@hexbattle/utils';
import type { WalletAddress } from '@paima/sdk/utils';

export type ParsedSubmittedInput =
  | CreateLobbyInput
  | JoinLobbyInput
  | SubmitMovesInput
  | SurrenderInput
  | ZombieScheduledInput
  | InvalidInput;

export interface InvalidInput {
  input: 'invalidString';
}
export interface CreateLobbyInput {
  input: 'createLobby';
  numOfPlayers: number;
}
export interface JoinLobbyInput {
  input: 'joinLobby';
  lobbyID: string;
}
export interface SurrenderInput {
  input: 'surrender';
  lobbyID: string;
}
export interface ZombieScheduledInput {
  input: 'zombieScheduledData';
  lobbyID: string;
}
export interface SubmitMovesInput {
  input: 'submitMoves';
  lobbyID: string;
  roundNumber: number;
  move: string[]; // this is a complex object
}

// export interface CreatedLobbyInput {
//   input: 'createdLobby';
//   numOfRounds: number;
//   roundLength: number;
//   playTimePerPlayer: number;
//   isHidden: boolean;
//   isPractice: boolean;
//   botDifficulty: number;
//   playerOneIsWhite: boolean;
// }

// export interface JoinedLobbyInput {
//   input: 'joinedLobby';
//   lobbyID: string;
// }

// export interface ClosedLobbyInput {
//   input: 'closedLobby';
//   lobbyID: string;
// }

// export interface SubmittedMovesInput {
//   input: 'submittedMoves';
//   lobbyID: string;
//   roundNumber: number;
//   pgnMove: string;
// }

// export interface ScheduledDataInput {
//   input: 'scheduledData';
// }

// export interface ZombieRound extends ScheduledDataInput {
//   effect: 'zombie';
//   lobbyID: string;
// }

// export interface UserStats extends ScheduledDataInput {
//   effect: 'stats';
//   user: WalletAddress;
//   result: ConciseResult;
//   ratingChange: number;
// }

// export interface BotMove extends ScheduledDataInput {
//   effect: 'move';
//   lobbyID: string;
//   roundNumber: number;
// }

// export function isZombieRound(input: ScheduledDataInput): input is ZombieRound {
//   return (input as ZombieRound).effect === 'zombie';
// }

// export function isUserStats(input: ScheduledDataInput): input is UserStats {
//   return (input as UserStats).effect === 'stats';
// }

// export function isBotMove(input: ScheduledDataInput): input is BotMove {
//   return (input as BotMove).effect === 'move';
// }
