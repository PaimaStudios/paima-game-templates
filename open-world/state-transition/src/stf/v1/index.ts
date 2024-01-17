import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import { submitIncrement, submitMove, joinWorld } from './persist/global.js';

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
    case 'joinWorld':
      return joinWorld(user, blockHeight, input, randomnessGenerator);
    case 'submitMove':
      return submitMove(user, blockHeight, input, randomnessGenerator);
    case 'submitIncrement':
      return submitIncrement(user, blockHeight, input, randomnessGenerator);
    default:
      return [];
  }
}
