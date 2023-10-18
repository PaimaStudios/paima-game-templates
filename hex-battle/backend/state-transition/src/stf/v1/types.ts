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
  units: string; // A, B, C, D
  buildings: string; // b, F, T, t
  gold: number;
  initTiles: number;
  map: string;
  timeLimit: number;
  roundLimit: number;

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
  roundNumber: number;
  count: number;
}
export interface SubmitMovesInput {
  input: 'submitMoves';
  lobbyID: string;
  roundNumber: number;
  move: string[]; // this is a complex object
}