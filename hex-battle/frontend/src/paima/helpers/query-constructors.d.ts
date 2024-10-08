import type { WalletAddress } from '@paima/sdk/utils';
export declare function getLobby(lobby_id: string): string;
export declare function getLobbyMap(lobby_id: string): string;
export declare function getLatestCreatedLobby(wallet: WalletAddress): string;
export declare function getOpenLobbies(wallet: WalletAddress, count: number, page: number): string;
export declare function getMyGames(wallet: WalletAddress, count: number, page: number): string;
export declare function getMoves(lobby_id: string, round: number): string;
export declare function getLeaderboardByLatest(wallet: string): string;
export declare function getLeaderboardByWins(wallet: string): string;
export declare function getLeaderboardByPlayed(wallet: string): string;
export declare function isGameOver(lobby_id: string): string;
