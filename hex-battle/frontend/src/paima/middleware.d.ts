import { cardanoWalletLoginEndpoint, switchToBatchedCardanoMode, switchToBatchedEthMode, switchToBatchedPolkadotMode, switchToUnbatchedMode, switchToAutomaticMode, userWalletLoginWithoutChecks, updateBackendUri, getRemoteBackendVersion } from '@paima/sdk/mw-core';
declare const endpoints: {
    submitMoves: (lobbyID: string, roundNumber: number, move: string[]) => Promise<import("@paima/sdk/mw-core").FailedResult | {
        success: true;
        data: {
            message: string;
        };
    }>;
    exportLogs: () => string;
    pushLog: (message: any, ...optionalParams: any[]) => void;
    getLatestProcessedBlockHeight: () => Promise<import("@paima/sdk/mw-core").Result<number>>;
    userWalletLogin: (loginType: string, preferBatchedMode?: boolean | undefined) => Promise<import("@paima/sdk/mw-core").Result<import("@paima/sdk/mw-core").Wallet>>;
    checkWalletStatus: () => Promise<import("@paima/sdk/mw-core").OldResult>;
};
export * from './types';
export { userWalletLoginWithoutChecks, cardanoWalletLoginEndpoint, switchToUnbatchedMode, switchToBatchedEthMode, switchToBatchedCardanoMode, switchToBatchedPolkadotMode, switchToAutomaticMode, updateBackendUri, getRemoteBackendVersion, };
export default endpoints;
