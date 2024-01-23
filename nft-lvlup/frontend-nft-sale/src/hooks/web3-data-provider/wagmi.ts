import type {
  PublicClient,
  WalletClient,
  Chain,
  JsonRpcAccount,
  CustomTransport,
  Address,
} from 'viem';
import { createPublicClient, createWalletClient } from 'viem';
import { createConfig, createStorage, custom, http } from '@wagmi/core';
import { injected } from '@wagmi/connectors';
import type { WalletMode } from '@paima/providers';
import { WalletModeMap } from '@paima/providers';
import {
  CHAIN_ID,
  CHAIN_EXPLORER_URI,
  CHAIN_NAME,
  CHAIN_URI,
  CHAIN_CURRENCY_NAME,
  CHAIN_CURRENCY_SYMBOL,
  CHAIN_CURRENCY_DECIMALS,
} from '../../services/constants';

// TODO: replace with a Paima Viem package eventually
export const supportedChain: Chain = {
  id: CHAIN_ID,
  name: CHAIN_NAME,
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

// we have to use a type alias because Vite requires isolatedModules which disallows const enums
const evmInjectedMode: WalletMode.EvmInjected = 0;

// TODO: replace with a Paima Viem package eventually
export function getHttpClient(chain: Chain): PublicClient {
  return createPublicClient({
    chain,
    transport: http(),
  });
}
// TODO: replace with a Paima Viem package eventually
export function getInjectedWallet(
  chain: Chain
): WalletClient<CustomTransport, Chain, JsonRpcAccount<Address>> {
  const provider = WalletModeMap[evmInjectedMode].getOrThrowProvider();
  return createWalletClient({
    account: provider.address as `0x${string}`,
    chain,
    transport: custom(provider.getConnection().api),
  });
}

// todo: will probably want to turn this into a connector as part of a paima-wagmi package
// https://github.com/PaimaStudios/paima-engine/issues/292
export const paimaConnector = injected({
  target() {
    return {
      // note: this ID doesn't have to be eip-6963
      id: '@paima/providers',
      name: 'Paima Provider Wrapper',
      provider: WalletModeMap[evmInjectedMode].getOrThrowProvider().getConnection().api as any,
    };
  },
});
// TODO: https://github.com/PaimaStudios/paima-engine/issues/292
export const wagmiConfig = createConfig({
  chains: [supportedChain],
  client({ chain }) {
    return getInjectedWallet(chain);
  },
  ...(typeof window !== 'undefined' && {
    storage: createStorage({
      storage: window.localStorage,
      key: 'nft.characters',
    }),
  }),
  // start with no connectors since we will inject a connector later once the Paima `userWalletLogin` is done
  // using
  // ```ts
  //     const { connect } = useConnect();
  //     connect({ connector: paimaConnector });
  // ```
  // note: careful connectors are not added automatically even though it's defined in the transport of our client
  //       wagmi instead does the opposite where transports are generated from connectors if not specified
  connectors: [],
  // we purposely turn off all wallet connection logic
  // this is because Paima will handle connecting the wallet
  // and WAGMI should detect it as it listens to the EIP-1193 "connect" event
  multiInjectedProviderDiscovery: false,
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
