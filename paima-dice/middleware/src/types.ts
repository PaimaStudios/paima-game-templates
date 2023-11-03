import type { Hash } from '@paima/sdk/utils';

import type { BaseRoundStatus, LobbyState, LobbyStatus, NewLobby, UserStats } from '@dice/utils';
import type { IGetLobbyByIdResult, IGetPaginatedUserLobbiesResult } from '@dice/db';

export interface RoundEnd {
  blocks: number;
  seconds: number;
}

export interface CreateLobbySuccessfulResponse {
  success: true;
  lobbyID: Hash;
  lobbyStatus: LobbyStatus;
}

export interface NewLobbies {
  success: true;
  lobbies: NewLobby[];
}

export interface PackedLobbyRaw {
  success: true;
  lobby: IGetLobbyByIdResult;
}

export interface PackedLobbyState {
  success: true;
  lobby: LobbyState;
}

export interface RoundExecutionState extends BaseRoundStatus {
  roundEndsInBlocks: number;
  roundEndsInSeconds: number;
}

export interface PackedRoundExecutionState {
  success: true;
  round: RoundExecutionState;
}

export interface LobbyStates {
  success: true;
  lobbies: LobbyState[];
}

export interface PackedUserLobbies {
  success: true;
  lobbies: IGetPaginatedUserLobbiesResult[];
}

export interface PackedUserStats {
  success: true;
  stats: UserStats;
}
