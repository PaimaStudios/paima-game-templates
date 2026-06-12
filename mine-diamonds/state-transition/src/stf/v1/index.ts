import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import { SCHEDULED_DATA_ADDRESS, type SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import {
  submitMineAttempt,
  orderCreated,
  assetMinted,
  assetTransferred,
  orderFilled,
  orderCancelled,
} from './persist/global.js';

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);

  switch (input.input) {
    case 'submitMineAttempt':
      return submitMineAttempt(user, randomnessGenerator);
    case 'orderCreated':
      if (inputData.realAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log(
          `WARNING: Scheduled Events can only be called from paima-engine. Called by ${JSON.stringify(inputData)}`
        );
        return [];
      }
      return orderCreated(input);
    case 'orderCancelled':
      if (inputData.realAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log(
          `WARNING: Scheduled Events can only be called from paima-engine. Called by ${JSON.stringify(inputData)}`
        );
        return [];
      }
      return orderCancelled(input);
    case 'orderFilled':
      if (inputData.realAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log(
          `WARNING: Scheduled Events can only be called from paima-engine. Called by ${JSON.stringify(inputData)}`
        );
        return [];
      }
      return orderFilled(input);
    case 'assetMinted':
      if (inputData.realAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log(
          `WARNING: Scheduled Events can only be called from paima-engine. Called by ${JSON.stringify(inputData)}`
        );
        return [];
      }
      return assetMinted(input);
    case 'assetTransferred':
      if (inputData.realAddress !== SCHEDULED_DATA_ADDRESS) {
        console.log(
          `WARNING: Scheduled Events can only be called from paima-engine. Called by ${JSON.stringify(inputData)}`
        );
        return [];
      }
      return assetTransferred(input);
    default:
      return [];
  }
}
