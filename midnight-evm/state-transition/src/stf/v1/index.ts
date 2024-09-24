import type { PoolClient } from 'pg';
import parse from './parser.js';
import type Prando from '@paima/sdk/prando.js';

import type { SQLUpdate } from '@paima/node-sdk/db.js';
import { PreExecutionBlockHeader, STFSubmittedData } from '@paima/sdk/chain-types.js';
import { insertMidnightEvmEvent, IInsertMidnightEvmEventParams } from '@midnightevm/db';
// entrypoint for your state machine
export default async function (
  inputData: STFSubmittedData,
  blockHeader: PreExecutionBlockHeader,
  randomnessGenerator: Prando,
  dbConn: PoolClient
): Promise<{ stateTransitions: SQLUpdate[]; events: [] }> {
  console.log(inputData, 'parsing input data');
  // @ts-ignore
  const user = inputData.userAddress.toLowerCase();
  const parsed = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${parsed.input}`);

  switch (parsed.input) {
    case 'midnightIncrement': {
      const insertMidnightEvmEventParams: IInsertMidnightEvmEventParams = {
        block_height: blockHeader.blockHeight,
        raw: String(parsed.raw),
        source: 'midnight_increment',
        unix_time: (new Date().getTime() / 1000) | 0,
      }
      return { stateTransitions: [[insertMidnightEvmEvent, insertMidnightEvmEventParams]], events: [] }
    }
    default:
      return { stateTransitions: [], events: [] };
  }
}
