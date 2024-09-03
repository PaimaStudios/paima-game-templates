import { paimaEndpoints } from '@paima/sdk/mw-core';
import {
  initMiddlewareCore,
  updateBackendUri,
  getRemoteBackendVersion,
  postConciselyEncodedData,
} from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@game/utils';

import { WalletMode } from '@paima/sdk/providers';

import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,
};

import * as Types from './types';
import type {
  TransactionRequest,
  Provider,
  BlockTag,
  TransactionResponse,
  FeeData,
} from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';
import type { BigNumber } from '@ethersproject/bignumber';
import type { Bytes } from '@ethersproject/bytes';
import type { Deferrable } from '@ethersproject/properties';
import { uint8ArrayToHexString } from '@paima/sdk/utils';
declare const Android: any;

(window as any).asyncCallback = (code: string, result: any) => {
  const promiseResolution = codes[code];
  console.log('asyncCallback', code, result, promiseResolution);
  if (promiseResolution) {
    promiseResolution(result);
  }
  return 'run code: ' + code;
};

const codes: Record<string, (args: any) => void> = {};

const call = <T>(name: string, arg1: string = ' '): Promise<T> => {
  const code = new Date().getTime() + '-' + Math.random();
  console.log('call1', name, code, arg1);
  const execute = (resolve: Function) => (args: any) => resolve(args);

  const promise = new Promise<T>((resolve, reject) => {
    console.log('call2', name, code, arg1, Android.query);
    Android.query(name, code, arg1);
    codes[code] = execute(resolve);
  });
  // codes[code] = promise;
  return promise;
};

const connectAPIWallet = async (title: string, description: string, lat: number, lon: number) => {
  const w = await endpoints.userWalletLogin({
    mode: WalletMode.EvmEthers,
    connection: {
      metadata: {
        name: 'noname',
        displayName: 'API Wallet',
      },
      api: {
        getAddress: async function (): Promise<string> {
          return await call<string>('getAddress');
        },
        signMessage: async function (message: Bytes | string): Promise<string> {
          const m = uint8ArrayToHexString(message as Uint8Array);
          return await call<string>('signMessage', m);
        },
        signTransaction: function (transaction: Deferrable<TransactionRequest>): Promise<string> {
          throw new Error('signTransaction not implemented');
        },
        connect: function (provider: Provider): Signer {
          throw new Error('connect not implemented');
        },
        _isSigner: true,
        getBalance: function (blockTag?: BlockTag): Promise<BigNumber> {
          throw new Error('getBalance not implemented');
        },
        getTransactionCount: async function (_?: BlockTag): Promise<number> {
          return await call<number>('getTransactionCount');
        },
        estimateGas: function (transaction: Deferrable<TransactionRequest>): Promise<BigNumber> {
          throw new Error('estimateGas not implemented');
        },
        call: function (
          transaction: Deferrable<TransactionRequest>,
          blockTag?: BlockTag
        ): Promise<string> {
          throw new Error('call not implemented');
        },
        sendTransaction: function (
          transaction: Deferrable<TransactionRequest>
        ): Promise<TransactionResponse> {
          throw new Error('sendTransaction not implemented');
        },
        getChainId: function (): Promise<number> {
          throw new Error('getChainId not implemented');
        },
        getGasPrice: function (): Promise<BigNumber> {
          throw new Error('getGasPrice not implemented');
        },
        getFeeData: async function (): Promise<FeeData> {
          throw new Error('getFeeData not implemented');
        },
        resolveName: function (name: string): Promise<string> {
          throw new Error('resolveName not implemented');
        },
        checkTransaction: function (): Deferrable<TransactionRequest> {
          throw new Error('checkTransaction not implemented');
        },
        populateTransaction: function (): Promise<TransactionRequest> {
          throw new Error('populateTransaction not implemented');
        },
        _checkProvider: function (operation?: string): void {
          throw new Error('_checkProvider not implemented');
        },
      },
    },
    preferBatchedMode: true,
  });
  if (w.success) {
    await endpoints.newLocation(title, description, lat, lon);
  }
  return w;
};

export const Paima = {
  Types,
  updateBackendUri,
  getRemoteBackendVersion,
  postConciselyEncodedData,
  endpoints,
  connectAPIWallet,
};
