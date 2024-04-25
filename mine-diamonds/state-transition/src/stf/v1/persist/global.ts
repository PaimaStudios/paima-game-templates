import type { SQLUpdate } from '@paima/node-sdk/db';
import type Prando from '@paima/sdk/prando';
import type { WalletAddress } from '@paima/sdk/utils';
import type {
  ICreateGlobalUserStateParams,
  ICreateUserTokenStateParams,
  IUpdateUserStateCurrentTokenIdParams,
} from '@game/db';
import { createGlobalUserState } from '@game/db';
import { createUserTokenState } from '@game/db';
import { updateUserStateCurrentTokenId } from '@game/db';
import type { JoinWorldInput, SubmitMineAttemptInput } from '../types';

export function joinWorld(
  player: WalletAddress,
  blockHeight: number,
  inputData: JoinWorldInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistNewUser(player)];
}

export function submitMineAttempt(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMineAttemptInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [
    persistMineAttempt(
      player,
      randomnessGenerator.nextInt(1, 10),
      randomnessGenerator.nextInt(0, 1) === 0
    ),
    persistUpdateUserStateCurrentTokenId(player),
  ];
}

function persistNewUser(wallet: WalletAddress): SQLUpdate {
  const params: ICreateGlobalUserStateParams = { wallet };
  return [createGlobalUserState, params];
}

function persistMineAttempt(wallet: WalletAddress, amount: number, isDiamond: boolean): SQLUpdate {
  const params: ICreateUserTokenStateParams = { wallet, amount, isDiamond };

  return [createUserTokenState, params];
}

function persistUpdateUserStateCurrentTokenId(wallet: WalletAddress): SQLUpdate {
  const params: IUpdateUserStateCurrentTokenIdParams = { wallet };

  return [updateUserStateCurrentTokenId, params];
}
