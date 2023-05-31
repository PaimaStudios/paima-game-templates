import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import type { Chain } from 'wagmi';
import { configureChains, createClient, createStorage } from 'wagmi';
import {
  CHAIN_ID,
  CHAIN_EXPLORER_URI,
  CHAIN_NAME,
  CHAIN_URI,
  CHAIN_CURRENCY_NAME,
  CHAIN_CURRENCY_SYMBOL,
  CHAIN_CURRENCY_DECIMALS,
} from '../../services/constants';

export const supportedChain: Chain = {
  id: CHAIN_ID,
  name: CHAIN_NAME,
  network: CHAIN_NAME,
  nativeCurrency: {
    name: CHAIN_CURRENCY_NAME,
    symbol: CHAIN_CURRENCY_SYMBOL,
    decimals: CHAIN_CURRENCY_DECIMALS,
  },
  rpcUrls: {
    public: { http: [CHAIN_URI] },
    default: { http: [CHAIN_URI] },
  },
  blockExplorers: {
    etherscan: { name: '', url: '' },
    default: {
      name: '',
      url: CHAIN_EXPLORER_URI,
    },
  },
};

export const { provider, webSocketProvider } = configureChains(
  [supportedChain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: CHAIN_URI,
      }),
    }),
  ]
);

export const client = createClient({
  autoConnect: true,
  ...(typeof window !== 'undefined' && {
    storage: createStorage({
      storage: window.localStorage,
      key: 'nft.characters',
    }),
  }),
  provider,
  webSocketProvider,
});
