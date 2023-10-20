import type { CardRegistry } from './types';

export const COMMITMENT_LENGTH = 16;
export const DECK_LENGTH = 10;
export const PACK_LENGTH = 5;
export const INITIAL_HIT_POINTS = 4;

// Values must match move_kind in db. No need for a type check, it will cause errors somewhere.
export const MOVE_KIND = {
  endTurn: 'end',
  playCard: 'play',
  // mini todo: Many games can target with a hand card too.
  // It makes sense to separate them, because this one doesn't need a reveal.
  targetCardWithBoardCard: 'targetB',
} as const;

export const TICK_EVENT_KIND = {
  tx: 'tx',
  postTx: 'postTx',
  playCard: 'playCard',
  destroyCard: 'destroyCard',
  applyPoints: 'applyPoints',
  turnEnd: 'turnEnd',
  roundEnd: 'roundEnd',
  matchEnd: 'matchEnd',
} as const;

export const CARD_REGISTRY: CardRegistry = {
  0: { defeats: 1 },
  1: { defeats: 2 },
  2: { defeats: 0 },
};

export const CARD_IDS = Object.keys(CARD_REGISTRY).map(key => Number.parseInt(key));

export const GENERIC_PAYMENT_MESSAGES = {
  buyCardPack: 'pack',
} as const;

export const PARSER_KEYS = {
  accountMint: 'accountMint',
  tradeNftMint: 'tradeNftMint',
  createdLobby: 'createdLobby',
  joinedLobby: 'joinedLobby',
  closedLobby: 'closedLobby',
  submittedMoves: 'submittedMoves',
  practiceMoves: 'practiceMoves',
  zombieScheduledData: 'zombieScheduledData',
  userScheduledData: 'userScheduledData',
  setTradeNftCards: 'setTradeNftCards',
  genericPayment: 'genericPayment',
  transferTradeNft: 'transferTradeNft',
} as const;

export const PARSER_PREFIXES = {
  [PARSER_KEYS.accountMint]: 'accMint',
  [PARSER_KEYS.tradeNftMint]: 'tradeMint',
  [PARSER_KEYS.createdLobby]: 'c',
  [PARSER_KEYS.joinedLobby]: 'j',
  [PARSER_KEYS.closedLobby]: 'cs',
  [PARSER_KEYS.submittedMoves]: 's',
  [PARSER_KEYS.practiceMoves]: 'p',
  [PARSER_KEYS.zombieScheduledData]: 'z',
  [PARSER_KEYS.userScheduledData]: 'u',
  [PARSER_KEYS.setTradeNftCards]: 't',
  [PARSER_KEYS.genericPayment]: 'generic',
  [PARSER_KEYS.transferTradeNft]: 'tradeTransfer',
} as const;
