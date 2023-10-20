import type { CardDbId, ConciseResult, PARSER_KEYS, SerializedMove } from '@cards/game-logic';
import type { WalletAddress } from '@paima/sdk/utils';

export type ParsedSubmittedInputRaw =
  | InvalidInput
  | NftMintInput
  | TradeNftMintInput
  | CreatedLobbyInput
  | JoinedLobbyInput
  | ClosedLobbyInput
  | SubmittedMovesInput
  | PracticeMovesInput
  | ZombieRoundInput
  | UserStatsInput
  | SetTradeNftCardsInput;

export type ParsedSubmittedInput =
  | InvalidInput
  | NftMintInput
  | TradeNftMintInput
  | GenericPaymentInput
  | CreatedLobbyInput
  | JoinedLobbyInput
  | ClosedLobbyInput
  | SubmittedMovesInput
  | PracticeMovesInput
  | ZombieRoundInput
  | UserStatsInput
  | SetTradeNftCardsInput
  | TransferTradeNftInput;

export interface InvalidInput {
  input: 'invalidString';
}

export interface NftMintInput {
  input: typeof PARSER_KEYS.accountMint;
  tokenId: string;
  // contract address
  address: WalletAddress;
}

export interface TradeNftMintInput {
  input: typeof PARSER_KEYS.tradeNftMint;
  tokenId: string;
  // contract address
  address: WalletAddress;
}

export interface GenericPaymentInput {
  input: typeof PARSER_KEYS.genericPayment;
  message: string;
  payer: WalletAddress;
  amount: bigint;
}

export interface TransferTradeNftInput {
  input: typeof PARSER_KEYS.transferTradeNft;
  from: WalletAddress;
  to: WalletAddress;
  tradeNftId: number;
}

export interface CreatedLobbyInput {
  input: typeof PARSER_KEYS.createdLobby;
  creatorNftId: number;
  creatorCommitments: Uint8Array;
  numOfRounds: number;
  turnLength: number;
  isHidden: boolean;
  isPractice: boolean;
}

export interface JoinedLobbyInput {
  input: typeof PARSER_KEYS.joinedLobby;
  nftId: number;
  commitments: Uint8Array;
  lobbyID: string;
}

export interface ClosedLobbyInput {
  input: typeof PARSER_KEYS.closedLobby;
  lobbyID: string;
}

export interface SubmittedMovesInput {
  input: typeof PARSER_KEYS.submittedMoves;
  nftId: number;
  lobbyID: string;
  matchWithinLobby: number;
  roundWithinMatch: number;
  move: SerializedMove;
}

export interface PracticeMovesInput {
  input: typeof PARSER_KEYS.practiceMoves;
  lobbyID: string;
  matchWithinLobby: number;
  roundWithinMatch: number;
}

export interface ZombieRoundInput {
  input: typeof PARSER_KEYS.zombieScheduledData;
  lobbyID: string;
}

export interface UserStatsInput {
  input: typeof PARSER_KEYS.userScheduledData;
  nftId: number;
  result: ConciseResult;
}

export interface SetTradeNftCardsInput {
  input: typeof PARSER_KEYS.setTradeNftCards;
  tradeNftId: number;
  cards: CardDbId[];
}
