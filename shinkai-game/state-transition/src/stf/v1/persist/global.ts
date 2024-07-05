import type { SQLUpdate } from '@paima/node-sdk/db';
import type Prando from '@paima/sdk/prando';
import { ShinkaiAPI } from '@game/shinkai';

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

export async function submitMove(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMoveInput,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const sql: SQLUpdate[] = [];
  try {
    const question = 'select a random number between 1000 and 9999. return only number.';
    const shinkai = new ShinkaiAPI();
    const ai_x = parseInt((await shinkai.askQuestion(question)).response, 10);
    const ai_y = parseInt((await shinkai.askQuestion(question)).response, 10);
    console.log('AI decided to move to:', ai_x % 10, ai_y % 10);
    sql.push(persistUserPosition('-1', ai_x % 10, ai_y % 10));
  } catch (e) {
    console.log('wat?', e);
  }

  sql.push(persistUserPosition(player, inputData.x, inputData.y));
  return sql;
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
