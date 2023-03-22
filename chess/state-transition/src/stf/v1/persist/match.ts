import type { SubmittedMovesInput } from '../types.js';
import type {
  IGetLobbyByIdResult,
  IGetRoundDataResult,
  INewRoundParams,
  INewMatchMoveParams,
  IExecutedRoundParams,
  IUpdateLatestMatchStateParams,
} from '@chess/db';
import {
  newMatchMove,
  newRound,
  updateLatestMatchState,
  newFinalState,
  executedRound,
} from '@chess/db';
import type { MatchEnvironment, MatchState } from '@chess/game-logic';
import type { WalletAddress } from 'paima-sdk/paima-utils';
import type { ConciseResult, ExpandedResult, MatchResult } from '@chess/utils';
import { scheduleZombieRound, deleteZombieRound } from './zombie.js';
import type { INewFinalStateParams } from '@chess/db/src/insert.queries.js';
import type { SQLUpdate } from 'paima-sdk/paima-db';

// This function inserts a new empty round in the database.
// We also schedule a future zombie round execution.
export function persistNewRound(
  lobbyId: string,
  currentRound: number,
  currentMatchState: string,
  roundLength: number,
  blockHeight: number
): SQLUpdate[] {
  // Creation of the next round
  const nrParams: INewRoundParams = {
    lobby_id: lobbyId,
    round_within_match: currentRound + 1,
    match_state: currentMatchState,
    starting_block_height: blockHeight,
    execution_block_height: null,
  };
  const newRoundTuple: SQLUpdate = [newRound, nrParams];

  // Scheduling of the zombie round execution in the future
  const zombie_block_height = blockHeight + roundLength;
  const zombieRoundUpdate: SQLUpdate = scheduleZombieRound(lobbyId, zombie_block_height);

  return [newRoundTuple, zombieRoundUpdate];
}

// Persist moves sent by player to an active match
export function persistMoveSubmission(
  player: WalletAddress,
  inputData: SubmittedMovesInput,
  lobby: IGetLobbyByIdResult
): SQLUpdate {
  const mmParams: INewMatchMoveParams = {
    new_move: {
      lobby_id: inputData.lobbyID,
      wallet: player,
      round: lobby.current_round,
      move_pgn: inputData.pgnMove,
    },
  };
  return [newMatchMove, mmParams];
}
// Persist an executed round (and delete scheduled zombie round input)
export function persistExecutedRound(
  roundData: IGetRoundDataResult,
  lobby: IGetLobbyByIdResult,
  blockHeight: number
): SQLUpdate[] {
  // We close the round by updating it with the execution blockHeight
  const exParams: IExecutedRoundParams = {
    lobby_id: lobby.lobby_id,
    round: lobby.current_round,
    execution_block_height: blockHeight,
  };
  const executedRoundTuple: SQLUpdate = [executedRound, exParams];

  // We remove the scheduled zombie round input
  if (lobby.round_length) {
    const block_height = roundData.starting_block_height + lobby.round_length;
    return [executedRoundTuple, deleteZombieRound(lobby.lobby_id, block_height)];
  }
  return [executedRoundTuple];
}

const expandResult = (result: ConciseResult): ExpandedResult => {
  if (result === 'w') return 'win';
  if (result === 'l') return 'loss';
  return 'tie';
};

// Persist match results in the final states table
export function persistMatchResults(
  lobbyId: string,
  results: MatchResult,
  matchEnvironment: MatchEnvironment,
  newState: MatchState
): SQLUpdate {
  const params: INewFinalStateParams = {
    final_state: {
      lobby_id: lobbyId,
      player_one_iswhite: matchEnvironment.user1.color === 'w',
      player_one_wallet: matchEnvironment.user1.wallet,
      player_one_result: expandResult(results[0]),
      player_one_elapsed_time: 0, // Example TODO: for the developer to implement themselves
      player_two_wallet: matchEnvironment.user2.wallet,
      player_two_result: expandResult(results[1]),
      player_two_elapsed_time: 0, // Example TODO
      positions: newState.fenBoard,
    },
  };
  return [newFinalState, params];
}

// Update Lobby state with the updated board
export function persistUpdateMatchState(lobbyId: string, newMatchState: MatchState): SQLUpdate {
  const params: IUpdateLatestMatchStateParams = {
    lobby_id: lobbyId,
    latest_match_state: newMatchState.fenBoard,
  };
  return [updateLatestMatchState, params];
}
