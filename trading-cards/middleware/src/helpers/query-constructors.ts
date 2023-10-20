import { buildBackendQuery } from '@paima/sdk/mw-core';

export function backendQueryLobbyState(lobbyID: string): string {
  const endpoint = 'lobby/state';
  const options = {
    lobbyID,
  };
  return buildBackendQuery(endpoint, options);
}

export function backendQueryUserLobbiesBlockheight(nftId: number, blockHeight: number): string {
  const endpoint = 'lobby/userBlockHeight';
  const options = {
    nftId,
    blockHeight,
  };
  return buildBackendQuery(endpoint, options);
}
