import type { SQLUpdate } from '@paima/node-sdk/db';
import type Prando from '@paima/sdk/prando';
import type { WalletAddress } from '@paima/sdk/utils';
import type {
  ICreateGlobalUserStateParams,
  IUpdateUserGlobalPositionParams,
  IUpdateWorldStateCounterParams,
} from '@game/db';
import { createGlobalUserState } from '@game/db';
import { updateUserGlobalPosition } from '@game/db';
import { updateWorldStateCounter } from '@game/db';
import type { JoinWorldInput, SubmitIncrementInput, SubmitMoveInput } from '../types';

export function joinWorld(
  player: WalletAddress,
  blockHeight: number,
  inputData: JoinWorldInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistNewUser(player)];
}

export function submitMove(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMoveInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistUserPosition(player, inputData.x, inputData.y)];
}

export function submitIncrement(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitIncrementInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistWorldCount(inputData.x, inputData.y)];
}

function persistWorldCount(x: number, y: number): SQLUpdate {
  const params: IUpdateWorldStateCounterParams = { x, y };
  return [updateWorldStateCounter, params];
}

function persistNewUser(wallet: WalletAddress): SQLUpdate {
  // const params: IUpdateUserGlobalPositionParams = { x, y, wallet };
  const params: ICreateGlobalUserStateParams = { wallet, x: 0, y: 0 };
  return [createGlobalUserState, params];
}

function persistUserPosition(wallet: WalletAddress, x: number, y: number): SQLUpdate {
  const params: IUpdateUserGlobalPositionParams = { x, y, wallet };

  return [updateUserGlobalPosition, params];
}
