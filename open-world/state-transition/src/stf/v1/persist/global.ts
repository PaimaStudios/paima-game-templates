import type { SQLUpdate } from 'paima-sdk/paima-db';
import type Prando from 'paima-sdk/paima-prando';
import type { WalletAddress } from 'paima-sdk/paima-utils';
import type {
  ICreateGlobalUserStateParams,
  IUpdateUserGlobalPositionParams,
  IUpdateWorldStateCounterParams,
} from '@game/db';
import { createGlobalUserState } from '@game/db';
import { updateUserGlobalPosition } from '@game/db';
import { updateWorldStateCounter } from '@game/db';
import type { JoinWorldInput, SubmitIncrementInput, SubmitMoveInput } from '../types';

export function joinWorld(
  player: WalletAddress,
  blockHeight: number,
  inputData: JoinWorldInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistNewUser(player)];
}

export function submitMove(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitMoveInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistUserPosition(player, inputData.x, inputData.y)];
}

export function submitIncrement(
  player: WalletAddress,
  blockHeight: number,
  inputData: SubmitIncrementInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  return [persistWorldCount(inputData.x, inputData.y)];
}

function persistWorldCount(x: number, y: number): SQLUpdate {
  const params: IUpdateWorldStateCounterParams = { x, y };
  return [updateWorldStateCounter, params];
}

function persistNewUser(wallet: WalletAddress): SQLUpdate {
  // const params: IUpdateUserGlobalPositionParams = { x, y, wallet };
  const params: ICreateGlobalUserStateParams = { wallet, x: 0, y: 0 };
  return [createGlobalUserState, params];
}

function persistUserPosition(wallet: WalletAddress, x: number, y: number): SQLUpdate {
  const params: IUpdateUserGlobalPositionParams = { x, y, wallet };

  return [updateUserGlobalPosition, params];
}

// Persist creation of a lobby
// export function persistLobbyCreation(

// ): SQLUpdate[] {
//   const lobby_id = randomnessGenerator.nextString(12);
//   const params = {
//     lobby_id: lobby_id,
//     num_of_rounds: inputData.numOfRounds,
//     round_length: inputData.roundLength,
//     play_time_per_player: inputData.playTimePerPlayer,
//     current_round: 0,
//     created_at: new Date(),
//     creation_block_height: blockHeight,
//     hidden: inputData.isHidden,
//     practice: inputData.isPractice,
//     lobby_creator: player,
//     player_one_iswhite: inputData.playerOneIsWhite,
//     player_two: null,
//     lobby_state: 'open' as LobbyStatus,
//     latest_match_state: new Chess().fen(),
//   } satisfies ICreateLobbyParams;

//   console.log(`Created lobby ${lobby_id}`);
//   // create the lobby according to the input data.
//   const createLobbyTuple: SQLUpdate = [createLobby, params];
//   // create user metadata if non existent
//   const blankStatsTuple: SQLUpdate = blankStats(player);
//   // In case of a practice lobby join with a predetermined opponent right away
//   const practiceLobbyUpdates = inputData.isPractice
//     ? persistLobbyJoin(
//         blockHeight,
//         PRACTICE_BOT_ADDRESS,
//         { input: 'joinedLobby', lobbyID: lobby_id },
//         params
//       )
//     : [];
//   return [createLobbyTuple, blankStatsTuple, ...practiceLobbyUpdates];
// }

// export function move

// // Persist joining a lobby
// export function persistLobbyJoin(
//   blockHeight: number,
//   joiningPlayer: WalletAddress,
//   inputData: JoinedLobbyInput,
//   lobby: IGetLobbyByIdResult
// ): SQLUpdate[] {
//   // First we validate if the lobby is actually open for users to join, before applying.
//   // If not, just output an empty list of updates (meaning no state transition is applied)
//   if (!lobby.player_two && lobby.lobby_state === 'open' && lobby.lobby_creator !== joiningPlayer) {
//     // Save user metadata, like in the lobby creation flow,
//     // then convert lobby into active and create empty round and user states
//     const updateLobbyTuple = persistActivateLobby(joiningPlayer, lobby, blockHeight, inputData);
//     const blankStatsTuple: SQLUpdate = blankStats(joiningPlayer);
//     return [...updateLobbyTuple, blankStatsTuple];
//   } else return [];
// }
