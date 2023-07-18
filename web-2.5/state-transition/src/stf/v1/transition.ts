import type { IGetUserResult } from '@game/db';
import { getUser } from '@game/db';
import type { SQLUpdate } from 'paima-sdk/paima-db';
import type { Pool } from 'pg';
import { persistNameUpdate, persistXpUpdate } from './persist';
import type { WalletAddress } from 'paima-sdk/paima-utils';
import type { GainExperienceInput } from './types';
import { GameENV } from '@game/utils';

const blankUserState: IGetUserResult = { experience: 0, wallet: '', name: null };

// State transition when a gain experience input is processed
export const gainExperience = async (
  postingUser: WalletAddress,
  input: GainExperienceInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  if (postingUser.toLowerCase() != GameENV.BATCHER_WALLET.toLowerCase()) {
    console.error('Admin input not posted by the batcher.');
    return [];
  }
  const [userState] = await getUser.run({ wallet: input.address }, dbConn);
  const userUpdateQuery = persistXpUpdate(
    input.address,
    input.experience,
    userState ?? blankUserState
  );
  return [userUpdateQuery];
};

export const changeName = async (
  user: WalletAddress,
  name: string,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [userState] = await getUser.run({ wallet: user }, dbConn);
  const userUpdateQuery = persistNameUpdate(user, name, userState ?? blankUserState);
  return [userUpdateQuery];
};
