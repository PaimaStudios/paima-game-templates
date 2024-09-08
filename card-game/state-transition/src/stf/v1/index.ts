import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import type {
  PreExecutionBlockHeader,
  STFSubmittedData,
} from '@paima/sdk/chain-types';
import { ENV } from '@paima/sdk/utils';
import { createScheduledData, type SQLUpdate } from '@paima/node-sdk/db';
import type { ICreateGlobalUserStateParams, IFlipCardParams, IGetUserStatsResult } from '@game/db';
import { getUserStats, createGlobalUserState, flipCard } from '@game/db';
import type { ClickInput, TickInput } from './types.js';
import { PrecompileNames, precompiles } from '@game/precompiles';
import { events, type Events } from '@game/events';
import { encodeEventForStf } from '@paima/events';

async function tickCommand(input: TickInput, blockHeader: PreExecutionBlockHeader) {
  const sqlUpdate: SQLUpdate[] = [];
  sqlUpdate.push(
    createScheduledData(`tick|${input.n + 1}`, blockHeader.blockHeight + 60 / ENV.BLOCK_TIME, {
      precompile: precompiles[PrecompileNames.GameTick],
    })
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
  inputData: STFSubmittedData,
  blockHeader: PreExecutionBlockHeader,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<{ stateTransitions: SQLUpdate[]; events: Events }> {
  console.log(inputData, 'parsing input data');
  const user = 'userAddress' in inputData ? inputData.userAddress.toLowerCase() : '0x0';
  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);
  const [userData] = await getUserStats.run({}, dbConn);

  switch (input.input) {
    case 'tick':
      return { stateTransitions: await tickCommand(input, blockHeader), events: [] };
    case 'click':
      return {
        stateTransitions: await clickCommand(input, user, userData),
        events: [
          encodeEventForStf({
            from: user as `0x${string}`,
            topic: events.ClickEvent,
            data: {
              user,
              time: blockHeader.msTimestamp,
            },
          }),
        ],
      };
    default:
      return { stateTransitions: [], events: [] };
  }
}
