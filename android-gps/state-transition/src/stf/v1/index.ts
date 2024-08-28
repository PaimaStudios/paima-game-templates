import type { Pool } from 'pg';

import parse from './parser.js';
import type Prando from '@paima/sdk/prando';
import { type SubmittedChainData } from '@paima/sdk/utils';
import { SQLUpdate } from '@paima/node-sdk/db.js';
import { INewLocationParams, newLocation } from '@game/db';


// entrypoint for your state machine
export default async function (
  inputData: SubmittedChainData,
  blockHeight: number,
  randomnessGenerator: Prando,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  console.log(inputData, 'parsing input data');
  const user = inputData.userAddress.toLowerCase();
  const input = parse(inputData.inputData);
  console.log(`Processing input string: ${inputData.inputData}`);
  console.log(`Input string parsed as: ${input.input}`);

  switch (input.input) {
    case 'createLocation':
      const locationParams: INewLocationParams = {
        description: input.description,
        latitude: parseFloat(input.lat),
        longitude: parseFloat(input.lon),
        title: input.title,
        wallet: user
      };
      console.log('DB Query', locationParams);
      return [[newLocation, locationParams]]
    default:
      return [];
  }
}
