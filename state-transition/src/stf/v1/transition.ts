import type { IGetUserResult } from '@game/db';
import { getUser } from '@game/db';
import type { SQLUpdate } from '@paima/node-sdk/db';
import type { Pool } from 'pg';
import type { GainExperienceInput } from './types.js';
import { persistUserUpdate } from './persist';

// State transition when a gain experience input is processed
export const gainExperience = async (
  expanded: GainExperienceInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [userState] = await getUser.run({ wallet: expanded.address }, dbConn);
  const blankUserState: IGetUserResult = { experience: 0, wallet: expanded.address };
  const userUpdateQuery = persistUserUpdate(
    expanded.address,
    expanded.experience,
    userState ?? blankUserState
  );
  return [userUpdateQuery];
};
