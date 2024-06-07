import { backendQueryUser } from '../helpers/query-constructors';
import type { Result, UserState } from '../types';

async function getUserState(wallet: string): Promise<Result<UserState>> {
  const query = backendQueryUser(wallet);
  const response = await fetch(query);

  const json = (await response.json()) as UserState;
  return {
    success: true,
    result: json,
  };
}

export const queryEndpoints = {
  getUserState,
};
