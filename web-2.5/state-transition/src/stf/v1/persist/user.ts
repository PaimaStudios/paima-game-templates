import type { IGetUserResult, IUpsertUserParams } from '@game/db';
import { upsertUser } from '@game/db';
import { calculateProgress } from '@game/game-logic';
import type { SQLUpdate } from 'paima-sdk/paima-db';

// this file deals with receiving blockchain data input and outputting SQL updates (imported from pgTyped output of our SQL files)
// PGTyped SQL updates are a tuple of the function calling the database and the params sent to it.

export function persistXpUpdate(wallet: string, gainedXp: number, user: IGetUserResult): SQLUpdate {
  const userParams: IUpsertUserParams = {
    ...user,
    wallet: wallet.toLowerCase(),
    experience: calculateProgress(user.experience, gainedXp),
  };
  return [upsertUser, userParams];
}

export function persistNameUpdate(
  wallet: string,
  newName: string,
  user: IGetUserResult
): SQLUpdate {
  const userParams: IUpsertUserParams = {
    ...user,
    wallet: wallet.toLowerCase(),
    name: newName,
  };
  return [upsertUser, userParams];
}
