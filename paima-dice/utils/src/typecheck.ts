import type { IGetLobbyByIdResult } from '@dice/db';
import type { LobbyWithStateProps } from './types';

// Type inference is set up wrong. It can infer that individual properties are not null
// but not that object type does not include the null property.
export function isLobbyWithStateProps(lobby: IGetLobbyByIdResult): lobby is LobbyWithStateProps {
  if (
    lobby.current_match == null ||
    lobby.current_round == null ||
    lobby.current_turn == null ||
    lobby.current_proper_round == null
  ) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _check: LobbyWithStateProps = {
    ...lobby,
    current_match: lobby.current_match,
    current_round: lobby.current_round,
    current_turn: lobby.current_turn,
    current_proper_round: lobby.current_proper_round,
  };

  return true;
}
