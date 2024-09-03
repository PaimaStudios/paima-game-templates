import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import { type SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db.js';
import type { IUpsertItemParams } from '@game/db';
import { getUser, newUser, upsertItem } from '@game/db';

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const poster = inputData.userAddress.toLowerCase();
  console.log(`Processing input from user: ${poster}`);
  if (poster !== '0x1234567890123456789012345678901234567890') {
    console.log('Invalid payment address');
    // for now we will allow any address to make a payment
  }
  const sqlUpdate: SQLUpdate[] = [];

  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);

  switch (input.input) {
    case 'purchase_item':
      const { item_id, amount, wallet } = input;
      const w = wallet.toLowerCase();
      const [userState] = await getUser.run({ wallet: w }, dbConn);
      if (!userState) {
        sqlUpdate.push([newUser, { wallet }]);
      }
      if (item_id < 1 || item_id > 1000) {
        console.log('Item ID out of range');
        return [];
      }

      const upsertItemParam: IUpsertItemParams = {
        amount,
        item_id: String(item_id),
        wallet: w,
      };
      sqlUpdate.push([upsertItem, upsertItemParam]);
      break;
    default:
      console.log('Invalid input string');
      break;
  }

  return sqlUpdate;
}
