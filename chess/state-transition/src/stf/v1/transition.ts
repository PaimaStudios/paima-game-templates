import type { Pool } from 'pg';
import type Prando from 'paima-sdk/paima-prando';
import type { WalletAddress } from 'paima-sdk/paima-utils';
import type { IGetLobbyByIdResult, IGetRoundDataResult, IGetRoundMovesResult } from '@chess/db';
import { getCachedMoves, getLobbyById, getRoundData, getUserStats, endMatch } from '@chess/db';
import type { MatchState } from '@chess/game-logic';
import {
  gameOver,
  initRoundExecutor,
  extractMatchEnvironment,
  matchResults,
} from '@chess/game-logic';
import {
  persistUpdateMatchState,
  persistCloseLobby,
  persistLobbyCreation,
  persistLobbyJoin,
  persistMoveSubmission,
  persistStatsUpdate,
  scheduleStatsUpdate,
  persistNewRound,
  persistExecutedRound,
  persistMatchResults,
  schedulePracticeMove,
} from './persist';
import { isValidMove } from '@chess/game-logic';
import type {
  ClosedLobbyInput,
  CreatedLobbyInput,
  JoinedLobbyInput,
  ScheduledDataInput,
  SubmittedMovesInput,
} from './types.js';
import { isUserStats, isZombieRound } from './types.js';
import type { ConciseResult } from '@chess/utils';
import type { SQLUpdate } from 'paima-sdk/paima-db';
import { PracticeAI } from './persist/practice-ai';

// State transition when a create lobby input is processed
export const createdLobby = async (
  player: WalletAddress,
  blockHeight: number,
  input: CreatedLobbyInput,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  return persistLobbyCreation(player, blockHeight, input, randomnessGenerator);
};

// State transition when a join lobby input is processed
export const joinedLobby = async (
  player: WalletAddress,
  blockHeight: number,
  input: JoinedLobbyInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (lobby) return persistLobbyJoin(blockHeight, player, input, lobby);
  else return [];
};

// State transition when a close lobby input is processed
export const closedLobby = async (
  player: WalletAddress,
  input: ClosedLobbyInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (!lobby) return [];
  const query = persistCloseLobby(player, lobby);
  // persisting failed the validation, bail
  if (!query) return [];
  console.log(query, 'closing lobby');
  return [query];
};

// State transition when a submit moves input is processed
export const submittedMoves = async (
  player: WalletAddress,
  blockHeight: number,
  input: SubmittedMovesInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  // Perform DB read queries to get needed data
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (!lobby) return [];
  const [round] = await getRoundData.run(
    { lobby_id: lobby.lobby_id, round_number: input.roundNumber },
    dbConn
  );
  // If the submitted moves are usable/all validation passes, continue
  if (!validateSubmittedMoves(lobby, round, input, player)) return [];
  // Generate update to persist the moves
  const persistMoveTuple = persistMoveSubmission(player, input, lobby);
  // We generated an SQL update for persisting the moves.
  // Now we capture the params (the moves typed as we need) and pass it to the round executor.
  const newMove: IGetRoundMovesResult = persistMoveTuple[1].new_move;
  // Execute the round and collect persist SQL updates
  const roundExecutionTuples = executeRound(
    blockHeight,
    lobby,
    [newMove],
    round,
    randomnessGenerator
  );

  // In practice mode we will submit a move for the AI
  if (lobby.practice) {
    // This is an example implementation of AI/Practice mode
    // Chess does not have a practice mode implemented.
    if (1) throw new Error('Practice AI : NYI');
    const practiceAI = new PracticeAI(lobby.latest_match_state, input.pgnMove, randomnessGenerator);
    const practiceMove = practiceAI.getNextMove();
    if (practiceMove) {
      const practiceMoveSchedule = schedulePracticeMove(
        lobby.lobby_id,
        lobby.current_round,
        practiceMove,
        blockHeight + 1
      );
      return [persistMoveTuple, ...roundExecutionTuples, practiceMoveSchedule];
    }
  }

  return [persistMoveTuple, ...roundExecutionTuples];
};

// Validate submitted moves in relation to player/lobby/round state
function validateSubmittedMoves(
  lobby: IGetLobbyByIdResult,
  round: IGetRoundDataResult,
  input: SubmittedMovesInput,
  player: WalletAddress
): boolean {
  // If lobby not active or existing
  if (!lobby || lobby.lobby_state !== 'active') return false;

  // If user does not belong to lobby
  const lobby_players = [lobby.lobby_creator, lobby.player_two];
  if (!lobby_players.includes(player)) return false;

  // Verify fetched round exists
  if (!round) return false;

  // If moves submitted don't target the current round
  if (input.roundNumber !== lobby.current_round) return false;

  // If a move is sent that doesn't fit in the lobby grid size or is strictly invalid
  if (!isValidMove(lobby.latest_match_state, input.pgnMove)) return false;

  return true;
}

// State transition when scheduled data is processed
export const scheduledData = async (
  blockHeight: number,
  input: ScheduledDataInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  // This executes 'zombie rounds', rounds which have reached the specified timeout time per round.
  if (isZombieRound(input)) {
    return zombieRound(blockHeight, input.lobbyID, dbConn, randomnessGenerator);
  }
  // Update the users stats
  if (isUserStats(input)) {
    return updateStats(input.user, input.result, dbConn);
  }
  return [];
};

// State transition when a zombie round input is processed
export const zombieRound = async (
  blockHeight: number,
  lobbyId: string,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  const [lobby] = await getLobbyById.run({ lobby_id: lobbyId }, dbConn);
  if (!lobby) return [];
  const [round] = await getRoundData.run(
    { lobby_id: lobby.lobby_id, round_number: lobby.current_round },
    dbConn
  );
  const cachedMoves = await getCachedMoves.run({ lobby_id: lobbyId }, dbConn);

  console.log(`Executing zombie round (#${lobby.current_round}) for lobby ${lobby.lobby_id}`);

  // We call the execute round function passing the unexecuted moves from the database, if any.
  // In practice for chess, there will be no cached moves as only one player goes per turn
  // and the round is instantly executed. As such this will simply proceed to the next round.
  return executeRound(blockHeight, lobby, cachedMoves, round, randomnessGenerator);
};

// State transition when an update stats input is processed
export const updateStats = async (
  player: WalletAddress,
  result: ConciseResult,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [stats] = await getUserStats.run({ wallet: player }, dbConn);
  // Verify coherency that the user has existing stats which can be updated
  if (stats) {
    const query = persistStatsUpdate(player, result, stats);
    console.log(query[1], `Updating stats of ${player}`);
    return [query];
  }
  return [];
};

// Runs the round executor and produces the necessary SQL updates as a result
export function executeRound(
  blockHeight: number,
  lobby: IGetLobbyByIdResult,
  moves: IGetRoundMovesResult[],
  roundData: IGetRoundDataResult,
  randomnessGenerator: Prando
): SQLUpdate[] {
  // We initialize the round executor object and run it/get the new match state via `.endState()`
  const executor = initRoundExecutor(
    lobby,
    roundData.round_within_match,
    roundData.match_state,
    moves,
    randomnessGenerator
  );
  const newState = executor.endState();

  // We generate updates to the lobby to apply the new match state
  const lobbyUpdate = persistUpdateMatchState(lobby.lobby_id, newState);

  // We generate updates for the executed round
  const executedRoundUpdate = persistExecutedRound(roundData, lobby, blockHeight);

  // Finalize match if game is over or we have reached the final round
  let roundResultUpdate: SQLUpdate[];
  if (gameOver(newState.fenBoard) || isFinalRound(lobby)) {
    console.log(lobby.lobby_id, 'match ended, finalizing');
    roundResultUpdate = finalizeMatch(blockHeight, lobby, newState);
  }
  // Else create a new round
  else {
    roundResultUpdate = persistNewRound(
      lobby.lobby_id,
      lobby.current_round,
      newState.fenBoard,
      lobby.round_length,
      blockHeight
    );
  }

  return [lobbyUpdate, ...executedRoundUpdate, ...roundResultUpdate].filter(
    (item): item is SQLUpdate => !!item
  );
}

// Finalizes the match and updates user statistics according to final score of the match
function finalizeMatch(
  blockHeight: number,
  lobby: IGetLobbyByIdResult,
  newState: MatchState
): SQLUpdate[] {
  const matchEnvironment = extractMatchEnvironment(lobby);

  // Create update which sets lobby state to 'finished'
  const endMatchTuple: SQLUpdate = [endMatch, { lobby_id: lobby.lobby_id }];

  // If practice lobby, then no extra results/stats need to be updated
  if (lobby.practice) {
    console.log(`Practice match ended, ignoring results`);
    return [endMatchTuple];
  }

  // Save the final results in the final states table
  const results = matchResults(newState, matchEnvironment);
  const resultsUpdate = persistMatchResults(lobby.lobby_id, results, matchEnvironment, newState);

  // Create the new scheduled data for updating user stats.
  // Stats are updated with scheduled data to support parallelism safely.
  const statsUpdate1 = scheduleStatsUpdate(
    matchEnvironment.user1.wallet,
    results[0],
    blockHeight + 1
  );
  const statsUpdate2 = scheduleStatsUpdate(
    matchEnvironment.user2.wallet,
    results[1],
    blockHeight + 1
  );
  return [endMatchTuple, resultsUpdate, statsUpdate1, statsUpdate2];
}

// Check if lobby is in final round
function isFinalRound(lobby: IGetLobbyByIdResult): boolean {
  if (lobby.num_of_rounds && lobby.current_round >= lobby.num_of_rounds) return true;
  return false;
}
