import type { Hash } from '@paima/sdk/utils';

import type {
  BaseRoundStatus,
  LobbyState,
  LobbyStatus,
  NewLobby,
  UserStats,
} from '@cards/game-logic';
import type { IGetLobbyByIdResult, IGetPaginatedUserLobbiesResult } from '@cards/db';

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
  lobby: null | IGetLobbyByIdResult;
}

export interface PackedLobbyState {
  success: true;
  lobby: null | LobbyState;
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
