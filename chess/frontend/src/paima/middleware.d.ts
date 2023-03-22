declare const endpoints: {
        createLobby: (numberOfRounds: number, roundLength: number, playTimePerPlayer: number, isHidden?: boolean, isPractice?: boolean, playerOneIsWhite = boolean) => Promise<import("types").CreateLobbyResponse>;
        joinLobby: (lobbyID: string) => Promise<import("types").OldResult>;
        closeLobby: (lobbyID: string) => Promise<import("types").OldResult>;
        submitMoves: (lobbyID: string, roundNumber: number, move: string) => Promise<import("types").OldResult>;
        setNft: (nftAddress: string, nftId: number) => Promise<import("types").OldResult>;
        getUserStats: (walletAddress: string) => Promise<import("types").FailedResult | import("types").PackedUserStats>;
        getLobbyState: (lobbyID: string) => Promise<import("types").FailedResult | import("types").PackedLobbyState>;
        getLobbySearch: (wallet: string, searchQuery: string, page: number, count?: number | undefined) => Promise<import("types").FailedResult | import("types").LobbyStates>;
        getRoundExecutionState: (lobbyID: string, round: number) => Promise<import("types").FailedResult | import("types").PackedRoundExecutionState>;
        getRandomOpenLobby: () => Promise<import("types").FailedResult | import("types").PackedLobbyState>;
        getOpenLobbies: (wallet: string, page: number, count?: number | undefined) => Promise<import("types").FailedResult | import("types").LobbyStates>;
        getUserLobbiesMatches: (walletAddress: string, page: number, count?: number | undefined) => Promise<import("types").FailedResult | import("types").LobbyStates>;
        getUserWalletNfts: (address: string) => Promise<import("types").FailedResult | import("types").SuccessfulResult<import("types").NFT[]>>;
        getLatestProcessedBlockHeight: () => Promise<import("types").FailedResult | import("types").SuccessfulResult<number>>;
        getNewLobbies: (wallet: string, blockHeight: number) => Promise<import("types").FailedResult | import("types").NewLobbies>;
        getUserSetNFT: (wallet: string) => Promise<import("types").FailedResult | import("types").SuccessfulResult<import("types").NFT>>;
        getMatchWinner: (lobbyId: string) => Promise<import("types").FailedResult | import("types").SuccessfulResult<import("@chess/utils").MatchWinnerResponse>>;
        getNftStats: (nftContract: string, tokenId: number) => Promise<import("types").FailedResult | import("types").SuccessfulResult<import("types").NftScore>>;
        getRoundExecutor: (lobbyId: string, roundNumber: number) => Promise<import("types").FailedResult | import("types").SuccessfulResult<any>>;
        getMatchExecutor: (lobbyId: string) => Promise<import("types").FailedResult | import("types").SuccessfulResult<any>>;
        userWalletLogin: (loginType: string) => Promise<import("types").FailedResult | import("types").Wallet>;
        checkWalletStatus: () => Promise<import("types").OldResult>;
        verifyWalletChain: () => Promise<boolean>;
    };
    // export * from "./types.d";
    export { getMiddlewareConfig, userWalletLoginWithoutChecks, cardanoWalletLoginEndpoint, switchToUnbatchedMode, switchToBatchedEthMode, switchToBatchedCardanoMode, updateBackendUri, getRemoteBackendVersion, postString, };
    export default endpoints;
//# sourceMappingURL=middleware.d.ts.map