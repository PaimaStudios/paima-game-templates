import { defineChain } from "viem";
import {
  CHAIN_URI,
  CHAIN_EXPLORER_URI,
  CHAIN_ID,
  CHAIN_NAME,
  CHAIN_CURRENCY_DECIMALS,
  CHAIN_CURRENCY_NAME,
  CHAIN_CURRENCY_SYMBOL,
} from "./constants";

// TODO: maybe add this as a util to Paima itself?
export const viemChain = defineChain({
  id: Number.parseInt(CHAIN_ID, 10),
  name: CHAIN_NAME,
  nativeCurrency: {
    decimals: CHAIN_CURRENCY_DECIMALS,
    name: CHAIN_CURRENCY_NAME,
    symbol: CHAIN_CURRENCY_SYMBOL,
  },
  rpcUrls: {
    default: {
      http: [CHAIN_URI],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: CHAIN_EXPLORER_URI },
  },
});
