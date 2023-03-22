import type {
  CreatedLobbyInput,
  JoinedLobbyInput,
  SubmittedMovesInput,
  WalletAddress,
} from './types.js';
import type {
  IGetLobbyByIdResult,
  IGetRoundDataResult,
  IGetUserStatsResult,
  INewStatsParams,
  INewRoundParams,
  IUpdateStatsParams,
  INewMatchMoveParams,
  IExecutedRoundParams,
  IStartMatchParams,
  ICloseLobbyParams,
  IGetFinalStateResult,
} from '@game/db';
import {
  createLobby,
  newMatchMove,
  newRound,
  newStats,
  updateStats,
  updateLatestMatchState,
  newFinalState,
  executedRound,
  startMatch,
  closeLobby,
} from '@game/db';
import type Prando from 'paima-sdk/paima-prando';
import type { MatchEnvironment, MatchResult, MatchState, RPSActions } from '@game/game-logic';
import { GameResult, RockPaperScissors, ShortNotationGameResult } from '@game/game-logic';
import type { SQLUpdate } from 'paima-sdk/paima-db';
import { createScheduledData, deleteScheduledData } from 'paima-sdk/paima-db';
import { PRACTICE_BOT_ADDRESS } from '@game/utils';

// Generate blank/empty user stats
function blankStats(wallet: string): SQLUpdate {
  const params: INewStatsParams = {
    wallet: wallet,
    wins: 0,
    ties: 0,
    losses: 0,
  };
  return [newStats as any, params];
}

// Persist updating user stats in DB
export function persistStatsUpdate(
  user: WalletAddress,
  result: ShortNotationGameResult,
  stats: IGetUserStatsResult
): SQLUpdate {
  const userParams: IUpdateStatsParams = {
    wallet: user,
    wins: result === ShortNotationGameResult.WIN ? stats.wins + 1 : stats.wins,
    losses: result === ShortNotationGameResult.LOSS ? stats.losses + 1 : stats.losses,
    ties: result === ShortNotationGameResult.TIE ? stats.ties + 1 : stats.ties,
  };
  return [updateStats as any, userParams];
}

// Persist creation of a lobby
export function persistLobbyCreation(
  player: WalletAddress,
  blockHeight: number,
  inputData: CreatedLobbyInput,
  randomnessGenerator: Prando
): SQLUpdate[] {
  const lobby_id = randomnessGenerator.nextString(12);
  const params: IGetLobbyByIdResult = {
    lobby_id: lobby_id,
    num_of_rounds: inputData.numOfRounds,
    round_length: inputData.roundLength,
    current_round: 0,
    created_at: new Date(),
    creation_block_height: blockHeight,
    hidden: inputData.isHidden,
    practice: inputData.isPractice,
    lobby_creator: player,
    player_two: null,
    lobby_state: 'open', // as LobbyStatus,
    round_winner: '',
    latest_match_state: RockPaperScissors.buildInitialState(inputData.numOfRounds),
  };

  console.log(`Created lobby ${lobby_id}`, params);
  // create the lobby according to the input data.
  const createLobbyTuple: SQLUpdate = [createLobby as any, params];
  // create user metadata if non existent
  const blankStatsTuple: SQLUpdate = blankStats(player);
  // In case of a practice lobby join with a predetermined opponent right away
  const practiceLobbyUpdates = inputData.isPractice
    ? persistLobbyJoin(
        blockHeight,
        PRACTICE_BOT_ADDRESS,
        { input: 'joinedLobby', lobbyID: lobby_id },
        params
      )
    : [];
  return [createLobbyTuple, blankStatsTuple, ...practiceLobbyUpdates];
}

// Persist joining a lobby
export function persistLobbyJoin(
  blockHeight: number,
  joiningPlayer: WalletAddress,
  inputData: JoinedLobbyInput,
  lobby: IGetLobbyByIdResult
): SQLUpdate[] {
  // First we validate if the lobby is actually open for users to join, before applying.
  // If not, just output an empty list of updates (meaning no state transition is applied)
  if (!lobby.player_two && lobby.lobby_state === 'open' && lobby.lobby_creator !== joiningPlayer) {
    // Save user metadata, like in the lobby creation flow,
    // then convert lobby into active and create empty round and user states
    const updateLobbyTuple = persistActivateLobby(joiningPlayer, lobby, blockHeight, inputData);
    const blankStatsTuple: SQLUpdate = blankStats(joiningPlayer);
    return [...updateLobbyTuple, blankStatsTuple];
  } else {
    return [];
  }
}

// Convert lobby state from `open` to `close`, meaning no one will be able to join the lobby.
export function persistCloseLobby(
  requestingPlayer: WalletAddress,
  lobby: IGetLobbyByIdResult
): SQLUpdate | null {
  if (lobby.player_two || lobby.lobby_state !== 'open' || lobby.lobby_creator !== requestingPlayer)
    return null;

  const params: ICloseLobbyParams = {
    lobby_id: lobby.lobby_id,
  };
  return [closeLobby as any, params];
}

// Convert lobby from `open` to `active`, meaning the match has now started.
function persistActivateLobby(
  joiningPlayer: WalletAddress,
  lobby: IGetLobbyByIdResult,
  blockHeight: number,
  _: JoinedLobbyInput
): SQLUpdate[] {
  // First update lobby row, marking its state as now 'active', and saving the joining player's wallet address
  const smParams: IStartMatchParams = {
    lobby_id: lobby.lobby_id,
    player_two: joiningPlayer,
  };
  const newMatchTuple: SQLUpdate = [startMatch as any, smParams];
  // We insert the round and first two empty user states in their tables at this stage, so the round executor has empty states to iterate from.
  const roundAndStates = persistInitialMatchState(lobby, blockHeight);
  return [newMatchTuple, ...roundAndStates];
}

// Create initial match state, used when a player joins a lobby to init the match.
function persistInitialMatchState(lobby: IGetLobbyByIdResult, blockHeight: number): SQLUpdate[] {
  return persistNewRound(lobby.lobby_id, 0, lobby.round_length, blockHeight);
}

// This function inserts a new empty round in the database.
// We also schedule a future zombie round execution.
export function persistNewRound(
  lobbyId: string,
  currentRound: number,
  roundLength: number | null,
  blockHeight: number
): SQLUpdate[] {
  // Creation of the next round
  const nrParams: INewRoundParams = {
    lobby_id: lobbyId,
    round_within_match: currentRound + 1,
    starting_block_height: blockHeight,
    execution_block_height: null,
  };
  const newRoundTuple: SQLUpdate = [newRound as any, nrParams];

  // Scheduling of the zombie round execution in the future
  const zombie_block_height = blockHeight + (roundLength ?? 1_000_000);
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
    lobby_id: inputData.lobbyID,
    wallet: player,
    round: lobby.current_round,
    move_rps: inputData.move_rps as any,
  };
  return [newMatchMove as any, mmParams];
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
  const executedRoundTuple: SQLUpdate = [executedRound as any, exParams];

  // We remove the scheduled zombie round input
  if (lobby.round_length) {
    const block_height = roundData.starting_block_height + lobby.round_length;
    return [executedRoundTuple, deleteZombieRound(lobby.lobby_id, block_height)];
  } else {
    return [executedRoundTuple];
  }
}

// Persist match results in the final states table
export function persistMatchResults(
  lobbyId: string,
  results: MatchResult,
  matchEnvironment: MatchEnvironment,
  newState: MatchState
): SQLUpdate {
  const finalState: IGetFinalStateResult = {
    lobby_id: lobbyId,
    player_one_wallet: matchEnvironment.user1.wallet,
    player_one_result: results[0],
    player_two_wallet: matchEnvironment.user2.wallet,
    player_two_result: results[1],
    total_time: 0, // TODO
    game_moves: newState.moves_rps,
  };
  return [newFinalState as any, finalState];
}

// Update Lobby state with the updated board
export function persistUpdateMatchState(
  lobbyId: string,
  roundState: string,
  newMatchState: MatchState
): SQLUpdate {
  return [
    updateLatestMatchState as any,
    { lobby_id: lobbyId, latest_match_state: newMatchState.moves_rps, round_winner: roundState },
  ];
}

// Schedule a zombie round to be executed in the future
export function scheduleZombieRound(lobbyId: string, block_height: number): SQLUpdate {
  return createScheduledData(createZombieInput(lobbyId), block_height);
}

// Delete a scheduled zombie round to be executed in the future
export function deleteZombieRound(lobbyId: string, block_height: number): SQLUpdate {
  return deleteScheduledData(createZombieInput(lobbyId), block_height);
}

// Create the zombie round input
function createZombieInput(lobbyId: string): string {
  return `z|*${lobbyId}`;
}

// Schedule a stats update to be executed in the future
export function scheduleStatsUpdate(
  wallet: WalletAddress,
  result: GameResult,
  block_height: number
): SQLUpdate {
  return createScheduledData(createStatsUpdateInput(wallet, result), block_height);
}

// Schedule a practive move update to be executed in the future
export function schedulePracticeMove(
  lobbyId: string,
  round: number,
  move: RPSActions,
  block_height: number
): SQLUpdate {
  return createScheduledData(createPracticeInput(lobbyId, round, move), block_height);
}

function createPracticeInput(lobbyId: string, round: number, move: RPSActions) {
  return `s|*${lobbyId}|${round}|${move}`;
}

// Create stats update input
function createStatsUpdateInput(wallet: WalletAddress, result: GameResult): string {
  // convert GameResult to Short Notation for commands
  // tie  => t
  // win  => w
  // lose => l
  let shortNotationResult = ShortNotationGameResult.TIE;
  if (result === GameResult.WIN) shortNotationResult = ShortNotationGameResult.WIN;
  else if (result === GameResult.LOSS) shortNotationResult = ShortNotationGameResult.LOSS;

  return `u|*${wallet}|${shortNotationResult}`;
}
