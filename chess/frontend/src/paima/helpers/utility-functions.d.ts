import type { PackedLobbyState, RoundEnd } from '../types';
export declare function userJoinedLobby(address: String, lobby: PackedLobbyState): boolean;
export declare function userCreatedLobby(address: String, lobby: PackedLobbyState): boolean;
export declare function lobbyWasClosed(lobby: PackedLobbyState): boolean;
export declare function calculateRoundEnd(roundStart: number, roundLength: number, current: number): RoundEnd;
