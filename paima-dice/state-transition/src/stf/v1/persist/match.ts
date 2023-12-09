import type { SubmittedMovesInput } from '../types.js';
import type { INewRoundParams, IExecutedRoundParams, IUpdateLobbyPlayerParams } from '@dice/db';
import { newRound, executedRound, updateLobbyPlayer } from '@dice/db';
import type { LobbyPlayer, MatchEnvironment } from '@dice/utils';
import {
  genPermutation,
  type LobbyWithStateProps,
  type MatchState,
  PRACTICE_BOT_NFT_ID,
} from '@dice/utils';
import { scheduleZombieRound } from './zombie.js';
import type { SQLUpdate } from '@paima/node-sdk/db';
import {
  updateLobbyCurrentMatch,
  updateLobbyCurrentRound,
  updateLobbyMatchState,
  updateLobbyState,
} from '@dice/db/src/update.queries.js';
import type {
  IUpdateLobbyCurrentMatchParams,
  IUpdateLobbyCurrentRoundParams,
  IUpdateLobbyMatchStateParams,
  IUpdateLobbyStateParams,
} from '@dice/db/src/update.queries.js';
import type { INewMatchParams, INewMoveParams } from '@dice/db/src/insert.queries.js';
import { newMatch, newMove } from '@dice/db/src/insert.queries.js';
import type { IGetRoundResult } from '@dice/db/src/select.queries.js';
import type Prando from '@paima/sdk/prando';
import { schedulePracticeMove } from './practice.js';
import { scheduleStatsUpdate } from './stats.js';

export function persistStartMatch(
  lobbyId: string,
  matchEnvironment: MatchEnvironment,
  players: LobbyPlayer[],
  current_match: null | number,
  roundLength: number,
  blockHeight: number,
  randomnessGenerator: Prando
): SQLUpdate[] {
  const matchWithinLobby = current_match == null ? 0 : current_match + 1;
  const newMatchParams: INewMatchParams = {
    lobby_id: lobbyId,
    match_within_lobby: matchWithinLobby,
    starting_block_height: blockHeight,
  };
  const newMatchUpdates: SQLUpdate[] = [[newMatch, newMatchParams]];

  const initialMatchStateUpdates = persistInitialMatchState(
    lobbyId,
    matchEnvironment,
    players,
    matchWithinLobby,
    roundLength,
    blockHeight,
    randomnessGenerator
  );
  return [...newMatchUpdates, ...initialMatchStateUpdates];
}

export function persistInitialMatchState(
  lobbyId: string,
  matchEnvironment: MatchEnvironment,
  players: LobbyPlayer[],
  matchWithinLobby: number,
  roundLength: number,
  blockHeight: number,
  randomnessGenerator: Prando
): SQLUpdate[] {
  const lobbyStateParams: IUpdateLobbyStateParams = {
    lobby_id: lobbyId,
    lobby_state: 'active',
  };
  const lobbyStateUpdates: SQLUpdate[] = [[updateLobbyState, lobbyStateParams]];

  const lobbyCurrentMatchParams: IUpdateLobbyCurrentMatchParams = {
    lobby_id: lobbyId,
    current_match: matchWithinLobby,
  };
  const lobbyCurrentMatchUpdates: SQLUpdate[] = [
    [updateLobbyCurrentMatch, lobbyCurrentMatchParams],
  ];

  const newTurnOrder = genPermutation(players.length, randomnessGenerator);
  const newMatchState: MatchState = {
    properRound: 0,
    turn: 0,
    players: players.map((player, i) => ({
      nftId: player.nftId,
      turn: newTurnOrder[i],
      points: 0,
      score: 0,
    })),
    result: undefined,
  };
  const matchStateUpdates = persistUpdateMatchState(
    lobbyId,
    matchEnvironment,
    newMatchState,
    blockHeight
  );

  const newRoundUpdates = persistNewRound(lobbyId, matchWithinLobby, 0, roundLength, blockHeight);

  // If a bot goes first, schedule a bot move
  const botMoves = (() => {
    const newTurnPlayer = newMatchState.players.find(player => player.turn === 0);
    const newTurnNftId = newTurnPlayer?.nftId;
    if (newTurnNftId !== PRACTICE_BOT_NFT_ID) return [];

    const practiceMoveSchedule = schedulePracticeMove(
      lobbyId,
      matchWithinLobby,
      0,
      blockHeight + 1
    );
    return [practiceMoveSchedule];
  })();

  return [
    ...lobbyStateUpdates,
    ...lobbyCurrentMatchUpdates,
    ...matchStateUpdates,
    ...newRoundUpdates,
    ...botMoves,
  ];
}

// This function inserts a new empty round in the database.
// We also schedule a future zombie round execution.
export function persistNewRound(
  lobbyId: string,
  matchWithinLobby: number,
  roundWithinMatch: number,
  roundLength: number,
  blockHeight: number
): SQLUpdate[] {
  // Creation of the next round
  const nrParams: INewRoundParams = {
    lobby_id: lobbyId,
    match_within_lobby: matchWithinLobby,
    round_within_match: roundWithinMatch,
    starting_block_height: blockHeight,
    execution_block_height: null,
  };
  const newRoundTuple: SQLUpdate[] = [[newRound, nrParams]];

  const updateCurrentRoundParams: IUpdateLobbyCurrentRoundParams = {
    lobby_id: lobbyId,
    current_round: roundWithinMatch,
  };
  const updateCurrentRoundTuple: SQLUpdate[] = [
    [updateLobbyCurrentRound, updateCurrentRoundParams],
  ];

  // Scheduling of the zombie round execution in the future
  const zombie_block_height = blockHeight + roundLength;
  const zombieRoundUpdate: SQLUpdate = scheduleZombieRound(lobbyId, zombie_block_height);

  return [...newRoundTuple, ...updateCurrentRoundTuple /* , zombieRoundUpdate TODO */];
}

// Persist moves sent by player to an active match
export function persistMoveSubmission(
  inputData: SubmittedMovesInput,
  lobby: LobbyWithStateProps
): { sqlUpdates: SQLUpdate[]; newMove: INewMoveParams } {
  const newMoveParams: INewMoveParams = {
    lobby_id: inputData.lobbyID,
    match_within_lobby: lobby.current_match,
    round_within_match: lobby.current_round,
    // TODO: currently round === move
    move_within_round: 0,
    nft_id: inputData.nftId,
    roll_again: inputData.rollAgain,
  };
  const newMoveUpdates: SQLUpdate[] = [[newMove, newMoveParams]];

  return {
    sqlUpdates: [...newMoveUpdates],
    newMove: newMoveParams,
  };
}
// Persist an executed round (and delete scheduled zombie round input)
export function persistExecutedRound(
  round: IGetRoundResult,
  lobby: LobbyWithStateProps,
  blockHeight: number
): SQLUpdate[] {
  // We close the round by updating it with the execution blockHeight
  const exParams: IExecutedRoundParams = {
    lobby_id: lobby.lobby_id,
    match_within_lobby: lobby.current_match,
    round_within_match: lobby.current_round,
    execution_block_height: blockHeight,
  };
  const executedRoundTuple: SQLUpdate = [executedRound, exParams];

  // TODO: zombie rounds are disabled ATM
  // We remove the scheduled zombie round input
  // if (lobby.round_length) {
  //   const block_height = roundData.starting_block_height + lobby.round_length;
  //   return [executedRoundTuple, deleteZombieRound(lobby.lobby_id, block_height)];
  // }
  return [executedRoundTuple];
}

// Persist match results in the final states table
export function persistMatchResults(finalMatchState: MatchState): SQLUpdate[] {
  const results = finalMatchState.result;
  // TODO
  return [];
}

// Update Lobby state with the updated state
export function persistUpdateMatchState(
  lobbyId: string,
  matchEnvironment: MatchEnvironment,
  newMatchState: MatchState,
  blockHeight: number
): SQLUpdate[] {
  if (newMatchState.players.length !== 2)
    throw new Error(`persistUpdateMatchState: missing players`);

  const playerParams: IUpdateLobbyPlayerParams[] = newMatchState.players.map(player => ({
    lobby_id: lobbyId,
    nft_id: player.nftId,
    points: player.points,
    score: player.score,
    turn: player.turn,
  }));
  const playerUpdates: SQLUpdate[] = playerParams.map(param => [updateLobbyPlayer, param]);

  const lobbyParams: IUpdateLobbyMatchStateParams = {
    lobby_id: lobbyId,
    current_turn: newMatchState.turn,
    current_proper_round: newMatchState.properRound,
  };
  const lobbyUpdates: SQLUpdate[] = [[updateLobbyMatchState, lobbyParams]];

  const finalizeMatchUpdates = finalizeMatch(lobbyId, matchEnvironment, newMatchState, blockHeight);

  return [...playerUpdates, ...lobbyUpdates, ...finalizeMatchUpdates];
}

// Finalizes the match and updates user statistics according to final score of the match
function finalizeMatch(
  lobbyId: string,
  matchEnvironment: MatchEnvironment,
  newMatchState: MatchState,
  blockHeight: number
): SQLUpdate[] {
  if (newMatchState.result == null) return [];
  const result = newMatchState.result;

  // TODO: support more than 1 match
  const updateStateParams: IUpdateLobbyStateParams = {
    lobby_id: lobbyId,
    lobby_state: 'finished',
  };
  const lobbyStateUpdates: SQLUpdate[] = [[updateLobbyState, updateStateParams]];

  // If practice lobby, then no extra results/stats need to be updated
  if (matchEnvironment.practice) {
    console.log(`Practice match ended, ignoring results`);
    return [...lobbyStateUpdates];
  }

  // Save the final results in the final states table
  const resultsUpdates = persistMatchResults(newMatchState);

  // Create the new scheduled data for updating user stats.
  // Stats are updated with scheduled data to support parallelism safely.
  const statsUpdates = newMatchState.players.map((player, i) =>
    scheduleStatsUpdate(player.nftId, result[i], blockHeight + 1)
  );
  return [...lobbyStateUpdates, ...resultsUpdates, ...statsUpdates];
}
