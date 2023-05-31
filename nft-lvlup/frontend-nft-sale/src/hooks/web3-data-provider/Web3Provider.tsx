import type { Provider } from '@wagmi/core';
import type { ReactElement } from 'react';
import React from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useProvider,
  useSwitchNetwork,
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { Web3Context } from '../useWeb3Context';
import { supportedChain } from './wagmi';
import { CHAIN_ID } from '../../services/constants';

export type Web3Data = {
  connectWallet: () => void;
  switchChain: ((chainId?: number) => void) | undefined;
  disconnectWallet: () => void;
  currentAccount: string;
  connected: boolean;
  loading: boolean;
  provider: Provider;
  chainId: number;
  network: string;
  error: Error | null;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const { connect: connectWallet, error } = useConnect({
    connector: new MetaMaskConnector(),
    chainId: supportedChain.id,
  });

  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { isConnected, isConnecting, address: account } = useAccount();
  const provider = useProvider();

  return (
    <Web3Context.Provider
      value={{
        web3ProviderData: {
          connectWallet,
          disconnectWallet: disconnect,
          switchChain: switchNetwork,
          provider,
          connected: isConnected,
          loading: isConnecting,
          chainId: chain?.id || CHAIN_ID,
          network: chain?.id == 2001 ? 'mainnet' : 'testnet',
          currentAccount: account?.toLowerCase() || '',
          error,
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
