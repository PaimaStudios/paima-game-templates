import type { SQLUpdate } from '@paima/node-sdk/db';
import type Prando from '@paima/sdk/prando';
import type { WalletAddress } from '@paima/sdk/utils';
import type {
  ICreateAssetTokenStateParams,
  ICreateGlobalUserStateParams,
  ICreateUserTokenStateParams,
  IUpdateUserStateCurrentTokenIdParams,
} from '@game/db';
import { createAssetTokenState, createGlobalUserState } from '@game/db';
import { createUserTokenState } from '@game/db';
import { updateUserStateCurrentTokenId } from '@game/db';
import type { AssetMintedInput, OrderCreatedInput, SubmitMineAttemptInput } from '../types';

export function submitMineAttempt(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMineAttemptInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [
    persistNewUser(player),
    persistMineAttempt(
      player,
      randomnessGenerator.nextInt(1, 10),
      randomnessGenerator.nextInt(0, 1) === 0
    ),
    persistUpdateUserStateCurrentTokenId(player),
  ];
}

export function orderCreated(
  player: WalletAddress,
  blockHeight: number,
  inputData: OrderCreatedInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [];
}

export function assetMinted(
  player: WalletAddress,
  blockHeight: number,
  inputData: AssetMintedInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [
    persistAssetMinted(
      inputData.payload.minter.toLowerCase(),
      inputData.payload.userTokenId,
      inputData.payload.tokenId,
      inputData.payload.value
    ),
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

function persistAssetMinted(
  wallet: WalletAddress,
  userTokenId: number,
  assetTokenId: number,
  amount: number
): SQLUpdate {
  const params: ICreateAssetTokenStateParams = { wallet, userTokenId, assetTokenId, amount };

  return [createAssetTokenState, params];
}
