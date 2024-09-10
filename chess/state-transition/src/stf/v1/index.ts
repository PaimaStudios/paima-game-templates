import type { PoolClient } from 'pg';
import parse from './parser.js';
import type Prando from '@paima/sdk/prando.js';
import {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  scheduledData,
} from './transition.js';
import type { SQLUpdate } from '@paima/node-sdk/db.js';
import { PreExecutionBlockHeader, STFSubmittedData } from '@paima/sdk/chain-types.js';

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
    case 'createdLobby':
      return {
        stateTransitions: await createdLobby(
          user,
          blockHeader.blockHeight,
          parsed,
          randomnessGenerator
        ),
        events: [],
      };
    case 'joinedLobby':
      return {
        stateTransitions: await joinedLobby(user, blockHeader.blockHeight, parsed, dbConn),
        events: [],
      };
    case 'closedLobby':
      return { stateTransitions: await closedLobby(user, parsed, dbConn), events: [] };
    case 'submittedMoves':
      return {
        stateTransitions: await submittedMoves(
          user,
          blockHeader.blockHeight,
          parsed,
          dbConn,
          randomnessGenerator
        ),
        events: [],
      };
    case 'scheduledData': {
      if (!inputData.scheduled) return { stateTransitions: [], events: [] };
      return {
        stateTransitions: await scheduledData(
          blockHeader.blockHeight,
          parsed,
          dbConn,
          randomnessGenerator
        ),
        events: [],
      };
    }
    default:
      return { stateTransitions: [], events: [] };
  }
}
