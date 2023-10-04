import { buildBackendQuery } from '@paima/sdk/mw-core';

export function backendQueryOwnedCharacters(wallet: string): string {
  const endpoint = 'owned_characters';
  const options = { wallet };
  return buildBackendQuery(endpoint, options);
}
