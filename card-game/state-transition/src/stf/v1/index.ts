import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import { ENV, type SubmittedChainData } from '@paima/sdk/utils';
import { createScheduledData, type SQLUpdate } from '@paima/node-sdk/db';
import type { ICreateGlobalUserStateParams, IFlipCardParams, IGetUserStatsResult } from '@game/db';
import { getUserStats, createGlobalUserState, flipCard } from '@game/db';
import type { ClickInput, TickInput } from './types.js';
import { PrecompileNames } from '@game/precompiles';

async function tickCommand(input: TickInput, blockHeight: number) {
  const sqlUpdate: SQLUpdate[] = [];
  sqlUpdate.push(
    createScheduledData(
      `tick|${input.n + 1}`,
      blockHeight + 60 / ENV.BLOCK_TIME,
      PrecompileNames.GameTick
    )
  );
  return sqlUpdate;
}

async function clickCommand(input: ClickInput, user: string, userData: IGetUserStatsResult | null) {
  const sqlUpdate: SQLUpdate[] = [];
  if (!userData) {
    const createGlobalUserStateParams: ICreateGlobalUserStateParams = {
      wallet: user,
    };
    sqlUpdate.push([createGlobalUserState, createGlobalUserStateParams]);
  }
  sqlUpdate.push([flipCard, { card: input.card } as IFlipCardParams]);
  return sqlUpdate;
}

// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = '0x0'; // inputData.userAddress.toLowerCase();
  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);
  const [userData] = await getUserStats.run({}, dbConn);

  switch (input.input) {
    case 'tick':
      return await tickCommand(input, blockHeight);
    case 'click':
      return await clickCommand(input, user, userData);
    default:
      return [];
  }
}
