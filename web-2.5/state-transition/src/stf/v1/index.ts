import parse, { isInvalid } from './parser.js';
import type Prando from 'paima-sdk/paima-prando';
import type { SubmittedChainData } from 'paima-sdk/paima-utils';
import type { SQLUpdate } from 'paima-sdk/paima-db';
import type { Pool } from 'pg';
import { gainExperience } from './transition.js';

export default async function (
  inputData: SubmittedChainData,
  _blockHeight: number,
  _randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  console.log(`Processing input string: ${inputData.inputData}`);
  const expanded = parse(inputData.inputData);
  if (isInvalid(expanded)) {
    console.log(`Invalid input string`);
    return [];
  }
  console.log(`Input string parsed as: ${expanded.input}`);

  switch (expanded.input) {
    case 'gainedExperience':
      gainExperience(expanded, dbConn);
    default:
      return [];
  }
}
