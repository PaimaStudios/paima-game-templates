import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import { changeName, gainExperience } from './transition.js';

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  _blockHeight: number,
  _randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  console.log(`Processing input string: ${inputData.inputData}`);
  const parsed = parse(inputData.inputData);
  if (isInvalid(parsed)) {
    console.log(`Invalid input string`);
    return [];
  }
  console.log(`Input string parsed as: ${parsed.input}`);

  const postingUser = inputData.userAddress.toLowerCase();
  switch (parsed.input) {
    case 'gainedExperience':
      return gainExperience(postingUser, parsed, dbConn);
    case 'changedName':
      // parsed.address in input used only for safe parallelism. could be removed if user state would be connected to another ID
      return changeName(postingUser, parsed.name, dbConn);
    default:
      return [];
  }
}
