import React, { useContext } from 'react';
import type { Web3Data } from './web3-data-provider/Web3Provider';

export type Web3ContextData = {
  web3ProviderData: Web3Data;
};

export const Web3Context = React.createContext({} as Web3ContextData);

export const useWeb3Context = () => {
  const { web3ProviderData } = useContext(Web3Context);
  if (web3ProviderData === undefined) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3ContextProvider />, ' +
        'please declare it at a higher level.'
    );
  }

  return web3ProviderData;
};
