import { paimaEndpoints, WalletConnectHelper } from '@paima/sdk/mw-core';
import { queryEndpoints } from './endpoints/queries';
import { writeEndpoints } from './endpoints/write';

import { initMiddlewareCore } from '@paima/sdk/mw-core';

import { gameBackendVersion, GAME_NAME } from '@game/utils';
import { DelegationOrder, DelegationOrderProgram, Secp256k1 } from '@game/mina-contracts';
import { AddressType } from '@paima/sdk/utils';

initMiddlewareCore(GAME_NAME, gameBackendVersion);

import { EvmInjectedConnector } from '@paima/providers';
import { PrivateKey, PublicKey } from 'o1js';

const temporaryPrivateKey = PrivateKey.random();

const endpoints = {
  ...paimaEndpoints,
  ...queryEndpoints,
  ...writeEndpoints,

  async compile() {
    await DelegationOrderProgram.compile();
  },

  async sign() {
    const provider = await EvmInjectedConnector.instance().connectSimple({ gameName: GAME_NAME, gameChainId: undefined });
    const signature = await provider.signMessage(DelegationOrder.bytesToSign(temporaryPrivateKey.toPublicKey()));
    console.log('signature', signature);
  },
};

export * from './types';
export type * from './types';

export default endpoints;
