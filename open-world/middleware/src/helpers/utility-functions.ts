import { ENV } from 'paima-sdk/paima-utils';
import { buildEndpointErrorFxn, ChessMiddlewareErrorCode } from '../errors';
import type { RoundEnd } from '../types';

// export function userJoinedLobby(address: String, lobby: PackedLobbyState): boolean {
//   if (!lobby.hasOwnProperty('lobby')) {
//     return false;
//   }
//   const lobbyState = lobby.lobby;

//   if (!lobbyState.hasOwnProperty('player_two')) {
//     return false;
//   }
//   if (!lobbyState.player_two || !address) {
//     return false;
//   }
//   return lobbyState.player_two.toLowerCase() === address.toLowerCase();
// }

// export function userCreatedLobby(address: String, lobby: PackedLobbyState): boolean {
//   if (!lobby.hasOwnProperty('lobby')) {
//     return false;
//   }
//   const lobbyState = lobby.lobby;

//   if (!lobbyState.hasOwnProperty('lobby_creator')) {
//     return false;
//   }
//   if (!lobbyState.lobby_creator || !address) {
//     return false;
//   }
//   return lobbyState.lobby_creator.toLowerCase() === address.toLowerCase();
// }

// export function lobbyWasClosed(lobby: PackedLobbyState): boolean {
//   const { lobby: lobbyState } = lobby;
//   if (!lobbyState) {
//     return false;
//   }

//   return lobbyState.lobby_state === 'closed';
// }

export function calculateRoundEnd(
  roundStart: number,
  roundLength: number,
  current: number
): RoundEnd {
  const errorFxn = buildEndpointErrorFxn('calculateRoundEnd');

  let roundEnd = roundStart + roundLength;
  if (roundEnd < current) {
    errorFxn(ChessMiddlewareErrorCode.CALCULATED_ROUND_END_IN_PAST);
    roundEnd = current;
  }

  try {
    const blocksToEnd = roundEnd - current;
    const secsPerBlock = ENV.BLOCK_TIME;
    const secondsToEnd = blocksToEnd * secsPerBlock;
    return {
      blocks: blocksToEnd,
      seconds: secondsToEnd,
    };
  } catch (err) {
    errorFxn(ChessMiddlewareErrorCode.INTERNAL_INVALID_DEPLOYMENT, err);
    return {
      blocks: 0,
      seconds: 0,
    };
  }
}
