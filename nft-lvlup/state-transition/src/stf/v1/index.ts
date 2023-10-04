import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/sdk/db';
import type { Pool } from 'pg';
import { lvlUp, scheduledData } from './transition.js';

export default async function (
  inputData: SubmittedChainData,
  _blockHeight: number,
  _randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  console.log(`Processing input string: ${inputData.inputData}`);
  const user = inputData.userAddress.toLowerCase();
  const parsed = parse(inputData.inputData);
  if (isInvalid(parsed)) {
    console.log(`Invalid input string`);
    return [];
  }
  console.log(`Input string parsed as: ${parsed.input}`);

  switch (parsed.input) {
    case 'lvlUp':
      return lvlUp(user, parsed, dbConn);
    case 'scheduledData':
      if (!inputData.scheduled) return [];
      return scheduledData(parsed);
    default:
      return [];
  }
}
