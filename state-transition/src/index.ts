import { ENV } from '@paima/sdk/utils';
import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';

export default function gameStateTransitionRouter(_blockHeight: number) {
  return async function gameStateTransitionV1(
    inputData: SubmittedChainData,
    _blockHeight: number,
    _randomnessGenerator: Prando,
    dbConn: Pool
  ): Promise<SQLUpdate[]> {
    console.log('inputData =', inputData);

    const expanded = parse(inputData.inputData);
    if (isInvalid(expanded)) {
      console.warn(`Invalid input string`);
      return [];
    }
    console.log('expanded =', expanded);

    switch (expanded.input) {
      case 'fork':
      case 'paint':
        return [];
      default:
        assertNever(expanded);
    }
  };
}

function assertNever(value: never): never {
  throw new Error("Unhandled discriminated union member: " + JSON.stringify(value));
}
