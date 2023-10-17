import { cardanoWalletLoginEndpoint, switchToBatchedCardanoMode, switchToBatchedEthMode, switchToBatchedPolkadotMode, switchToUnbatchedMode, switchToAutomaticMode, userWalletLoginWithoutChecks, updateBackendUri, getRemoteBackendVersion } from '@paima/sdk/mw-core';
import prando from '@paima/sdk/prando';
import { ENV } from '@paima/sdk/utils';
declare const endpoints: {
    createLobby: (numOfPlayers: number, units: string, buildings: string, gold: number, initTiles: number, map: string[]) => Promise<import("@paima/sdk/mw-core").FailedResult | {
        success: true;
        data: {
            lobbyId: string;
            lobbyStatus: string;
        };
    }>;
    joinLobby: (lobbyId: string) => Promise<import("@paima/sdk/mw-core").FailedResult | {
        success: true;
        data: Object;
    }>;
    surrender: (lobbyId: string) => Promise<import("@paima/sdk/mw-core").FailedResult | {
        success: true;
        data: {
            lobbyId: string;
            lobbyStatus: string;
        };
    }>;
    submitMoves: (lobbyID: string, roundNumber: number, move: string[]) => Promise<import("@paima/sdk/mw-core").FailedResult | {
        success: true;
        data: {
            message: string;
        };
    }>;
    getLobby: typeof import("./endpoints/queries").getLobby;
    getLobbyMap: typeof import("./endpoints/queries").getLobbyMap;
    getLatestCreatedLobby: typeof import("./endpoints/queries").getLatestCreatedLobby;
    getOpenLobbies: typeof import("./endpoints/queries").getOpenLobbies;
    getMyGames: typeof import("./endpoints/queries").getMyGames;
    getMoveForRound: typeof import("./endpoints/queries").getMoveForRound;
    getUserWallet: (wallet: string | null, errorFxn: import("@paima/sdk/mw-core").EndpointErrorFxn) => import("@paima/sdk/mw-core").Result<string>;
    exportLogs: () => string;
    pushLog: (message: any, ...optionalParams: any[]) => void;
    getLatestProcessedBlockHeight: () => Promise<import("@paima/sdk/mw-core").Result<number>>;
    userWalletLogin: (loginType: string, preferBatchedMode?: boolean | undefined) => Promise<import("@paima/sdk/mw-core").Result<import("@paima/sdk/mw-core").Wallet>>;
    checkWalletStatus: () => Promise<import("@paima/sdk/mw-core").OldResult>;
};
export { userWalletLoginWithoutChecks, cardanoWalletLoginEndpoint, switchToUnbatchedMode, switchToBatchedEthMode, switchToBatchedCardanoMode, switchToBatchedPolkadotMode, switchToAutomaticMode, updateBackendUri, getRemoteBackendVersion, prando, ENV, };
export default endpoints;
