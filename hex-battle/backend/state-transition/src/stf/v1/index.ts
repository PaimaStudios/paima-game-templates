import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type { SubmittedChainData } from '@paima/sdk/utils';

import type { SQLUpdate } from '@paima/sdk/db';

function createLobby(
  user: string,
  blockHeight: number,
  parsed: any,
  dbConn: Pool,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [];
}

function joinLobby(
  user: string,
  blockHeight: number,
  parsed: any,
  dbConn: Pool,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [];
}

function submitMoves(
  user: string,
  blockHeight: number,
  parsed: any,
  dbConn: Pool,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [];
}

function surrender(
  user: string,
  blockHeight: number,
  parsed: any,
  dbConn: Pool,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [];
}

function zombieScheduledData(
  user: string,
  blockHeight: number,
  parsed: any,
  dbConn: Pool,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [];
}

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
    case 'createLobby':
      return createLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'joinLobby':
      return joinLobby(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'submitMoves':
      return submitMoves(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'surrender':
      return surrender(user, blockHeight, parsed, dbConn, randomnessGenerator);

    case 'zombieScheduledData':
      return zombieScheduledData(user, blockHeight, parsed, dbConn, randomnessGenerator);

    default:
      return [];
  }
}
