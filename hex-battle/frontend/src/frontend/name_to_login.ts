import type {LoginInfo} from '@paima/sdk/mw-core';
import {WalletMode} from '@paima/sdk/providers';

export function nameToLogin(
  name: string,
  preferBatchedMode: boolean
): LoginInfo {
  switch (name) {
    case 'metamask': {
      if (preferBatchedMode) {
        return {
          mode: WalletMode.EvmInjected,
          preferBatchedMode,
          checkChainId: false,
        };
      }
      return {mode: WalletMode.EvmInjected, preferBatchedMode};
    }
    case 'cardano': {
      return {mode: WalletMode.Cardano};
    }
    case 'polkadot': {
      return {mode: WalletMode.Polkadot};
    }
    case 'pera': {
      return {mode: WalletMode.Algorand};
    }
    default:
      throw new Error(`Unknown name ${name}`);
  }
}
