import type { FailedResult, OldResult } from 'paima-sdk/paima-mw-core';
import type { MatchMove } from '@chess/game-logic';
import type { CreateLobbySuccessfulResponse } from '../types';
declare function createLobby(numberOfRounds: number, roundLength: number, playTimePerPlayer: number, isHidden?: boolean, isPractice?: boolean, playerOneIsWhite?: boolean): Promise<CreateLobbySuccessfulResponse | FailedResult>;
declare function joinLobby(lobbyID: string): Promise<OldResult>;
declare function closeLobby(lobbyID: string): Promise<OldResult>;
declare function submitMoves(lobbyID: string, roundNumber: number, move: MatchMove): Promise<OldResult>;
export declare const writeEndpoints: {
    createLobby: typeof createLobby;
    joinLobby: typeof joinLobby;
    closeLobby: typeof closeLobby;
    submitMoves: typeof submitMoves;
};
export {};
