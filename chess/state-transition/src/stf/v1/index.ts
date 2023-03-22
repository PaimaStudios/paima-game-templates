import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from 'paima-sdk/paima-prando';
import type { SubmittedChainData } from 'paima-sdk/paima-utils';
import {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  scheduledData,
} from './transition';
import type { SQLUpdate } from 'paima-sdk/paima-db';

export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const expanded = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${expanded.input}`);

  switch (expanded.input) {
    case 'createdLobby':
      return createdLobby(user, blockHeight, expanded, randomnessGenerator);
    case 'joinedLobby':
      return joinedLobby(user, blockHeight, expanded, dbConn);
    case 'closedLobby':
      return closedLobby(user, expanded, dbConn);
    case 'submittedMoves':
      return submittedMoves(user, blockHeight, expanded, dbConn, randomnessGenerator);
    case 'scheduledData': {
      if (!inputData.scheduled) return [];
      return scheduledData(blockHeight, expanded, dbConn, randomnessGenerator);
    }
    default:
      return [];
  }
}
