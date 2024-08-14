import parse, { isInvalid } from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import { SudokuZkApp, SudokuSolution, SudokuSolutionProof } from '@game/mina-contracts';

const SudokuZkApp_events_keys = Object.keys(SudokuZkApp.events);
let compiled = false;

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  _blockHeight: number,
  _randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log('Parsing input data', inputData);
  const expanded = parse(inputData.inputData);
  if (isInvalid(expanded)) {
    console.log(`Invalid input string`);
    return [];
  }
  console.log(`Input string parsed as: ${expanded.input}`);

  switch (expanded.input) {
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

    case 'sudokuProof':
      console.log('Sudoku proof:', {
        ...expanded.data,
        proof: `<${expanded.data.proof.length} base64 chars>`,
      });
      if (!compiled) {
        console.log('First-time compiling...');
        // forceRecompile or else hang: https://github.com/o1-labs/o1js/issues/1411
        await SudokuSolution.compile({ forceRecompile: true });
        compiled = true;
      }
      const proof = await SudokuSolutionProof.fromJSON(expanded.data);
      console.log('Verifying...');
      const verifies = await SudokuSolution.verify(proof);
      console.log('Verifies:', verifies, verifies ? '- all good' : '- uh oh, something went wrong');
      return [];

    default:
      assertNever(expanded);
  }
}

function assertNever(value: never): never {
  throw new Error('Unhandled discriminated union member: ' + JSON.stringify(value));
}
