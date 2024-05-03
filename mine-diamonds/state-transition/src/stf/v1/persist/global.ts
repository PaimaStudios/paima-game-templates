import type { SQLUpdate } from '@paima/node-sdk/db';
import type Prando from '@paima/sdk/prando';
import type { WalletAddress } from '@paima/sdk/utils';
import type {
  ICreateAssetOwnershipParams,
  ICreateAssetTokenStateParams,
  ICreateDexOrderParams,
  ICreateGlobalUserStateParams,
  ICreateUserTokenStateParams,
  IUpdateAssetOwnershipParams,
  IUpdateUserStateCurrentTokenIdParams,
} from '@game/db';
import {
  createAssetOwnership,
  createAssetTokenState,
  createDexOrder,
  createGlobalUserState,
  updateAssetOwnership,
} from '@game/db';
import { createUserTokenState } from '@game/db';
import { updateUserStateCurrentTokenId } from '@game/db';
import type { AssetMintedInput, AssetTransferredInput, OrderCreatedInput } from '../types';

export function submitMineAttempt(player: WalletAddress, randomnessGenerator: Prando): SQLUpdate[] {
  return [
    persistNewUser(player),
    persistMineAttempt(
      player,
      randomnessGenerator.nextInt(1, 10),
      randomnessGenerator.nextInt(1, 10) <= 7
    ),
    persistUpdateUserStateCurrentTokenId(player),
  ];
}

export function orderCreated(inputData: OrderCreatedInput): SQLUpdate[] {
  return [
    persistOrderCreated(
      inputData.payload.seller.toLowerCase(),
      Number(inputData.payload.assetAmount),
      Number(inputData.payload.assetId),
      Number(inputData.payload.orderId),
      inputData.payload.pricePerAsset
    ),
  ];
}

export function assetMinted(inputData: AssetMintedInput): SQLUpdate[] {
  return [
    persistAssetMinted(
      inputData.payload.minter.toLowerCase(),
      inputData.payload.userTokenId,
      inputData.payload.tokenId,
      inputData.payload.value
    ),
  ];
}

export function assetTransferred(inputData: AssetTransferredInput): SQLUpdate[] {
  const from = inputData.payload.from.toLowerCase();
  const to = inputData.payload.to.toLowerCase();
  const assetId = Number(inputData.payload.id);
  const delta = Number(inputData.payload.value);
  const queries: SQLUpdate[] = [
    persistNewAssetOwnership(from, assetId),
    persistNewAssetOwnership(to, assetId),
  ];
  if (inputData.payload.from !== '0x0000000000000000000000000000000000000000') {
    queries.push(persistAssetTransferred(inputData.payload.from.toLowerCase(), assetId, -delta));
  }
  if (inputData.payload.to !== '0x0000000000000000000000000000000000000000') {
    queries.push(persistAssetTransferred(inputData.payload.to.toLowerCase(), assetId, delta));
  }
  return queries;
}

function persistNewUser(wallet: WalletAddress): SQLUpdate {
  const params: ICreateGlobalUserStateParams = { wallet };
  return [createGlobalUserState, params];
}

function persistNewAssetOwnership(wallet: WalletAddress, assetTokenId: number): SQLUpdate {
  const params: ICreateAssetOwnershipParams = { wallet, assetTokenId, amount: 0 };
  return [createAssetOwnership, params];
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
  minter: WalletAddress,
  userTokenId: number,
  assetTokenId: number,
  amount: number
): SQLUpdate {
  const params: ICreateAssetTokenStateParams = {
    minter,
    userTokenId,
    assetTokenId,
    amount,
  };

  return [createAssetTokenState, params];
}

function persistAssetTransferred(
  wallet: WalletAddress,
  assetTokenId: number,
  delta: number
): SQLUpdate {
  const params: IUpdateAssetOwnershipParams = {
    wallet,
    assetTokenId,
    delta,
  };

  return [updateAssetOwnership, params];
}

function persistOrderCreated(
  seller: WalletAddress,
  amount: number,
  assetTokenId: number,
  orderId: number,
  price: string
): SQLUpdate {
  const params: ICreateDexOrderParams = { amount, assetTokenId, orderId, price, seller };

  return [createDexOrder, params];
}
