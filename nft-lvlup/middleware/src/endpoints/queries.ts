import type { OwnedCharactersResponse } from '@game/utils';
import { backendQueryOwnedCharacters } from '../helpers/query-constructors';
import type { Result } from '../types';

export async function getOwnedCharacters(wallet: string): Promise<Result<OwnedCharactersResponse>> {
  const query = backendQueryOwnedCharacters(wallet);
  const response = await fetch(query);

  const json = (await response.json()) as OwnedCharactersResponse;
  return {
    success: true,
    result: json,
  };
}

export const queryEndpoints = {
  getOwnedCharacters,
};
