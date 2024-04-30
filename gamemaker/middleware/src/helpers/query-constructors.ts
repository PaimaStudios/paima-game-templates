import { buildBackendQuery } from '@paima/sdk/mw-core';

export function backendQueryUser(wallet: string): string {
  const endpoint = 'user_state';
  const options = {
    wallet,
  };
  return buildBackendQuery(endpoint, options);
}
