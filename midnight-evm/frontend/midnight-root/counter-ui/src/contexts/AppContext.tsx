import { createContext, type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { encodeCoinPublicKey, type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import type { DAppConnectorWalletAPI, ServiceUriConfig } from '@midnight-ntwrk/dapp-connector-api';
import '@midnight-ntwrk/dapp-connector-api';
import { type Logger } from 'pino';
import {
  type PrivateStates,
  type CounterProviders,
  type CounterContract,
  type CounterCircuitKeys,
  type DeployedCounterContract,
} from './../common-types';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import {
  type UnbalancedTransaction,
  type BalancedTransaction,
  createBalancedTx,
  type MidnightProvider,
  type WalletProvider,
} from '@midnight-ntwrk/midnight-js-types';
import { type CoinInfo, Transaction, type TransactionId } from '@midnight-ntwrk/ledger';

import { Transaction as ZswapTransaction } from '@midnight-ntwrk/zswap';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import {
  Contract,
  ledger,
  witnesses,
  type CounterPrivateState,
  type Witnesses,
} from '@midnight-ntwrk/counter-contract';
import { findDeployedContract, withZswapWitnesses, type StateWithZswap } from '@midnight-ntwrk/midnight-js-contracts';

interface DispatchActionType {
  type: 'join';
  payload: '';
}

export interface AppContextTypes {
  isLoading: boolean;
  isClientInitialized: boolean;
  contractAddress: ContractAddress | null;
  counterValue: bigint | null;
  dispatch: (action: DispatchActionType) => Promise<string | undefined>;
}

export const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppProvider = ({ children, logger }: { children: ReactNode; logger: Logger }): ReactElement => {
  const [contractAddress, setContractAddress] = useState<ContractAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClientInitialized, setIsClientInitialized] = useState(false);
  const [provider, setProvider] = useState<CounterProviders | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [counterValue, setCounterValue] = useState<bigint | null>(null);

  const connectToWallet = async (): Promise<{ wallet: DAppConnectorWalletAPI; uris: ServiceUriConfig }> => {
    console.log('connect wallet', window.midnight?.mnLace);
    const wallet = await window.midnight?.mnLace?.enable();
    const uris = await window.midnight?.mnLace?.serviceUriConfig();
    if (!wallet || !uris) throw new Error('Could not find wallet');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    // const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet as any);
    const state = await wallet.state();
    const xprovider: WalletProvider & MidnightProvider = {
      coinPublicKey: state.coinPublicKey,
      balanceTx(tx: UnbalancedTransaction, newCoins: CoinInfo[]): Promise<BalancedTransaction> {
        return wallet
          .balanceTransaction(ZswapTransaction.deserialize(tx.tx.serialize()), newCoins)
          .then((tx) => wallet.proveTransaction(tx))
          .then((zswapTx) => Transaction.deserialize(zswapTx.serialize()))
          .then(createBalancedTx);
      },
      submitTx(tx: BalancedTransaction): Promise<TransactionId> {
        return wallet.submitTransaction(tx.tx);
      },
    };
    console.log({ xprovider, uris, state });

    const provider: CounterProviders = {
      privateStateProvider: levelPrivateStateProvider<PrivateStates>({
        privateStateStoreName: 'counterPrivateState',
      }),
      publicDataProvider: indexerPublicDataProvider(uris.indexerUri, uris.indexerWsUri),
      zkConfigProvider: new FetchZkConfigProvider(window.location.origin, fetch.bind(window)),
      // zkConfigProvider: new NodeZkConfigProvider<'increment'>(contractConfig.zkConfigPath),
      proofProvider: httpClientProofProvider(uris.proverServerUri),
      walletProvider: xprovider,
      midnightProvider: xprovider,
    };
    console.log({ provider });
    const contractAddress_ = '0100017747ddbf465f1807f8af623d2af762e05e67fb8b7a4e7970aa3ecb42bc3e6b71';
    setContractAddress(contractAddress_);

    const ee = encodeCoinPublicKey(xprovider.coinPublicKey);
    const zz = withZswapWitnesses(witnesses)(ee);

    console.log({ ee, zz });
    const contract: CounterContract = new Contract(zz);

    console.log({ contract, contractAddress });
    const deployedContract: DeployedCounterContract = await findDeployedContract<
      PrivateStates,
      'counterPrivateState',
      Witnesses<StateWithZswap<CounterPrivateState>>,
      CounterContract,
      CounterCircuitKeys
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    >(provider, contractAddress_, contract, {
      privateStateKey: 'counterPrivateState',
      initialPrivateState: {},
    });
    console.log({ deployedContract });

    const existingPrivateState = await provider.privateStateProvider.get('counterPrivateState');

    console.log({ existingPrivateState });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const counterValue = await getCounterLedgerState(provider, contractAddress_);
    setCounterValue(counterValue);
    console.log({ counterValue });

    const increment = async (): Promise<{ blockHeight: number; txHash: string }> => {
      logger.info('Incrementing...');
      const { txHash, blockHeight } = await deployedContract.contractCircuitsInterface.increment();
      logger.info(`Transaction ${txHash} added in block ${blockHeight}`);
      return { txHash, blockHeight };
    };
    await increment();

    return { wallet, uris };
  };

  const getCounterLedgerState = (
    providers: CounterProviders,
    contractAddress_: ContractAddress,
  ): Promise<bigint | null> =>
    providers.publicDataProvider
      .queryContractState(contractAddress_)
      .then((contractState) => (contractState != null ? ledger(contractState.data).round : null));

  useEffect(() => {
    logger.info('Initializing Midnight connection');
    // connectToWallet().then(({ wallet, uris }) => {
    //   console.log('wallet::', wallet, uris);
    // });
  }, []);

  // eslint-disable-next-line @typescript-eslint/require-await
  const dispatch = async (action: DispatchActionType): Promise<string | undefined> => {
    setIsLoading(true);
    try {
      switch (action.type) {
        case 'join': {
          console.log('prejoin');
          connectToWallet().then(({ wallet, uris }) => {
            console.log('wallet::', wallet, uris);
          });
        }
      }
    } catch (error) {
      console.log('ERROR', error);
    }
    setIsLoading(false);
    return 'what?';
  };

  return (
    <AppContext.Provider value={{ isLoading, isClientInitialized, contractAddress, dispatch, counterValue }}>
      {children}
    </AppContext.Provider>
  );
};
