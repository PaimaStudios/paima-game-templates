import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import { gainExperience } from './transition.js';

// Todo: it'd be nice to import this from the contracts project, but this
// brings an indirect dependency on "plonk_wasm_bg.wasm".
const SudokuZkApp_events_keys = ['puzzle-reset', 'puzzle-solved', 'test'];

// entrypoint for your state machine
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
      return gainExperience(expanded, dbConn);

    case 'sudokuEvent':
      for (const [index, value] of expanded.data.data) {
        const eventName = SudokuZkApp_events_keys[Number(index)];
        console.log('Sudoku event:', eventName, ' value:', value);
      }
      return [];

    case 'sudokuAction':
      for (const [index, value] of expanded.data.data) {
        console.log('Sudoku action: index:', index, ' public key of solver:', value);
      }
      return [];

    default:
      assertNever(expanded);
  }
}

function assertNever(value: never): never {
  throw new Error("Unhandled discriminated union member: " + JSON.stringify(value));
}
