import type { FailedResult } from '@paima/sdk/mw-core';
declare function createLobby(numOfPlayers: number, units: string, buildings: string, gold: number, initTiles: number, map: string[]): Promise<FailedResult | {
    success: true;
    data: {
        lobbyId: string;
        lobbyStatus: string;
    };
}>;
declare function joinLobby(lobbyId: string): Promise<FailedResult | {
    success: true;
    data: Object;
}>;
declare function surrender(lobbyId: string): Promise<FailedResult | {
    success: true;
    data: {
        lobbyId: string;
        lobbyStatus: string;
    };
}>;
declare function submitMoves(lobbyID: string, roundNumber: number, move: string[]): Promise<FailedResult | {
    success: true;
    data: {
        message: string;
    };
}>;
export declare const writeEndpoints: {
    createLobby: typeof createLobby;
    joinLobby: typeof joinLobby;
    surrender: typeof surrender;
    submitMoves: typeof submitMoves;
};
export {};
