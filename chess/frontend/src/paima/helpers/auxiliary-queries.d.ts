import type { FailedResult } from '@paima/sdk/mw-core';
import type { NewLobbies, PackedLobbyState } from '../types';
export declare function getRawLobbyState(lobbyID: string): Promise<PackedLobbyState | FailedResult>;
export declare function getRawNewLobbies(wallet: string, blockHeight: number): Promise<NewLobbies | FailedResult>;
export declare function getNonemptyNewLobbies(address: string, blockHeight: number): Promise<NewLobbies>;
export declare function getLobbyStateWithUser(lobbyID: string, address: string): Promise<PackedLobbyState>;
