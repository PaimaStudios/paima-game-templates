import BigNumber from "bignumber.js";

export const CHAIN_URI = process.env.CHAIN_URI as string;
export const NATIVE_PROXY = process.env.NATIVE_PROXY as string;
export const NFT = process.env.NFT as string;
export const CARD_TRADE_NATIVE_PROXY = process.env
  .CARD_TRADE_NATIVE_PROXY as string;
export const CARD_TRADE_NFT = process.env.CARD_TRADE_NFT as string;
export const CHAIN_EXPLORER_URI = process.env.CHAIN_EXPLORER_URI as string;
export const GENERIC_PAYMENT = process.env.GENERIC_PAYMENT as string;
export const GENERIC_PAYMENT_PROXY = process.env
  .GENERIC_PAYMENT_PROXY as string;
export const CHAIN_CURRENCY_DECIMALS = Number.parseInt(
  process.env.CHAIN_CURRENCY_DECIMALS as string,
);
const CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION = BigNumber(
  process.env.CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION as string,
);
export const CARD_PACK_PRICE = CARD_PACK_NFT_PRICE_DEFAULT_DENOMINATION.times(
  BigNumber(10).pow(CHAIN_CURRENCY_DECIMALS),
);

if (
  CHAIN_URI == null ||
  NATIVE_PROXY == null ||
  NFT == null ||
  CARD_TRADE_NATIVE_PROXY == null ||
  CARD_TRADE_NFT == null ||
  GENERIC_PAYMENT == null
)
  throw new Error(
    "ERROR: Did you forget to fill out .env or webpack.plugins.js?",
  );
