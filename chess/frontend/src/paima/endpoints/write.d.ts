import type { FailedResult, OldResult } from '@paima/sdk/mw-core';
import type { MatchMove } from '@chess/game-logic';
import type { CreateLobbySuccessfulResponse, PackedLobbyState } from '../types';
declare function createLobby(numberOfRounds: number, roundLength: number, playTimePerPlayer: number, botDifficulty: number, isHidden?: boolean, isPractice?: boolean, playerOneIsWhite?: boolean): Promise<CreateLobbySuccessfulResponse | FailedResult>;
declare function joinLobby(lobbyID: string): Promise<OldResult>;
declare function closeLobby(lobbyID: string): Promise<OldResult>;
declare function submitMoves(lobbyID: string, roundNumber: number, move: MatchMove): Promise<FailedResult | PackedLobbyState>;
export declare const writeEndpoints: {
    createLobby: typeof createLobby;
    joinLobby: typeof joinLobby;
    closeLobby: typeof closeLobby;
    submitMoves: typeof submitMoves;
};
export {};
