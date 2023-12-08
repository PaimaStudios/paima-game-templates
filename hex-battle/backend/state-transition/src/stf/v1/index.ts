import type { Pool } from 'pg';
import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';

import { submitMoves } from './submitMoves.js';
import { createLobby } from './createLobby.js';
import { joinLobby } from './joinLobby.js';
import { zombieScheduledData } from './zombie.js';

export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const parsed = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${parsed.input}`);

  switch (parsed.input) {
    case 'createLobby':
      return await createLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'joinLobby':
      return await joinLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'submitMoves':
      return await submitMoves(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'zombieScheduledData':
      return await zombieScheduledData(user, blockHeight, parsed, dbConn, randomnessGenerator);

    default:
      return [];
  }
}
