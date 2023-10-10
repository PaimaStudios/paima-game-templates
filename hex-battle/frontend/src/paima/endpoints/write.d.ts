import type { FailedResult } from '@paima/sdk/mw-core';
declare function submitMoves(lobbyID: string, roundNumber: number, move: string[]): Promise<FailedResult | {
    success: true;
    data: {
        message: string;
    };
}>;
export declare const writeEndpoints: {
    submitMoves: typeof submitMoves;
};
export {};
