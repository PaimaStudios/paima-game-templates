import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';
import {
  createdLobby,
  joinedLobby,
  closedLobby,
  submittedMoves,
  scheduledData,
  practiceMoves,
  mintNft,
} from './transition';
import type { SQLUpdate } from '@paima/node-sdk/db';

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
    case 'nftMint':
      return mintNft(parsed);
    case 'createdLobby':
      return createdLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);
    case 'joinedLobby':
      return joinedLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);
    case 'closedLobby':
      return closedLobby(user, parsed, dbConn);
    case 'submittedMoves':
      return submittedMoves(user, blockHeight, parsed, dbConn);
    case 'practiceMoves':
      return practiceMoves(user, blockHeight, parsed, dbConn);
    case 'scheduledData': {
      if (!inputData.scheduled) return [];
      return scheduledData(blockHeight, parsed, dbConn, randomnessGenerator);
    }
    default:
      return [];
  }
}
