import BigNumber from 'bignumber.js';

type VersionString = `${number}.${number}.${number}`;
const VERSION_MAJOR = 1;
const VERSION_MINOR = 1;
const VERSION_PATCH = 1;
export const gameBackendVersion: VersionString = `${VERSION_MAJOR}.${VERSION_MINOR}.${VERSION_PATCH}`;
export const GAME_NAME = 'Paima Cards';
// TODO: identify practice bot differently
// idea: there should be some "player in match" table anyways
// that table can have an 'isBot' flag
export const PRACTICE_BOT_NFT_ID = -1;
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/** Large number that should be safe anywhere */
export const SAFE_NUMBER = 2 ** 31 - 1;

export * from './types.js';

// Note: frontend has to get process.env values through webpack instead
export const NFT_NAME = process.env.NFT_NAME as string;
export const CARD_TRADE_NFT_NAME = process.env.CARD_TRADE_NFT_NAME as string;
export const CHAIN_CURRENCY_DECIMALS = Number.parseInt(
  process.env.CHAIN_CURRENCY_DECIMALS as string
);
const CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION = BigNumber(
  process.env.CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION as string
);
export const CARD_PACK_PRICE = CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION.times(
  BigNumber(10).pow(CHAIN_CURRENCY_DECIMALS)
);
