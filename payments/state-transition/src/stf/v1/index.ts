import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { STFSubmittedData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db.js';
import type { IUpsertItemParams } from '@game/db';
import { getUser, newUser, upsertItem } from '@game/db';
import { items } from './items.js';

// entrypoint for your state machine
export default async function (
  inputData: STFSubmittedData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  const sqlUpdate: SQLUpdate[] = [];
  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);

  switch (input.input) {
    case 'purchase_item':
      console.log('AMOUNT:', inputData.suppliedValue);

      const { item_id, amount, wallet } = input;

      const item = items.find(i => i.id === input.item_id);
      if (!item) {
        throw new Error('Item not found');
      }
      // Check if transaction value is enough to pay for the items
      if (
        // NOTE careful the multiplication here can overflow,
        // we have static values and know that work.
        BigInt(amount) * BigInt(1000000000000000000 * item.price) >
        BigInt(inputData.suppliedValue)
      ) {
        throw new Error('Not enough tokens sent to make the purchase');
      }

      const w = wallet.toLowerCase();
      // Get or create user
      const [userState] = await getUser.run({ wallet: w }, dbConn);
      if (!userState) {
        sqlUpdate.push([newUser, { wallet }]);
      }

      // Upsert item
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
