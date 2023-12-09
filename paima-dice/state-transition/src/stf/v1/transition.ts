import type { Pool } from 'pg';
import Prando from '@paima/sdk/prando';
import { SCHEDULED_DATA_ADDRESS, type SubmittedChainData } from '@paima/sdk/utils';
import type { IGetLobbyPlayersResult, IGetRoundMovesResult } from '@dice/db';
import { getLobbyById, getUserStats, getLobbyPlayers } from '@dice/db';
import type {
  LobbyWithStateProps,
  ConciseResult,
  LobbyPlayer,
  MatchEnvironment,
  MatchState,
} from '@dice/utils';
import {
  initRoundExecutor,
  buildCurrentMatchState,
  extractMatchEnvironment,
} from '@dice/game-logic';
import {
  persistUpdateMatchState,
  persistLobbyState,
  persistLobbyCreation,
  persistLobbyJoin,
  persistMoveSubmission,
  persistStatsUpdate,
  persistNewRound,
  persistExecutedRound,
  schedulePracticeMove,
  blankStats,
  persistStartMatch,
} from './persist';
import { isValidMove } from '@dice/game-logic';
import type {
  ClosedLobbyInput,
  CreatedLobbyInput,
  JoinedLobbyInput,
  NftMintInput,
  PracticeMovesInput,
  ScheduledDataInput,
  SubmittedMovesInput,
} from './types.js';
import { isUserStats, isZombieRound } from './types.js';
import { NFT_NAME, PRACTICE_BOT_NFT_ID, isLobbyWithStateProps } from '@dice/utils';
import { getBlockHeights, type SQLUpdate } from '@paima/node-sdk/db';
import { PracticeAI } from './persist/practice-ai';
import { getOwnedNfts } from '@paima/node-sdk/utils-backend';
import type { IGetRoundResult } from '@dice/db/src/select.queries';
import { getMatch, getRound, getRoundMoves } from '@dice/db/src/select.queries';
import type { WalletAddress } from '@paima/sdk/utils';

// Create initial player entry after nft mint
export const mintNft = async (input: NftMintInput): Promise<SQLUpdate[]> => {
  try {
    return [blankStats(Number.parseInt(input.tokenId))];
  } catch (e) {
    console.log(`DISCARD: error in nft mint ${e}`);
    return [];
  }
};

// State transition when a create lobby input is processed
export const createdLobby = async (
  player: WalletAddress,
  blockHeight: number,
  input: CreatedLobbyInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  const [block] = await getBlockHeights.run({ block_heights: [blockHeight] }, dbConn);
  if (!(await checkUserOwns(player, input.creatorNftId, dbConn))) {
    console.log('DISCARD: user does not own specified nft');
    return [];
  }
  return persistLobbyCreation(
    input.creatorNftId,
    blockHeight,
    input,
    block.seed,
    randomnessGenerator
  );
};

// State transition when a join lobby input is processed
export const joinedLobby = async (
  player: WalletAddress,
  blockHeight: number,
  input: JoinedLobbyInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (lobby == null) {
    console.log('DISCARD: lobby does not exist');
    return [];
  }
  const matchEnvironment: MatchEnvironment = extractMatchEnvironment(lobby);

  const rawPlayers = await getLobbyPlayers.run({ lobby_id: input.lobbyID }, dbConn);
  if (lobby.lobby_state !== 'open' || rawPlayers.length >= lobby.max_players) {
    console.log('DISCARD: lobby does not accept more players');
    return [];
  }
  const lobbyPlayers: LobbyPlayer[] = rawPlayers.map(player => ({
    nftId: player.nft_id,
    points: player.points,
    score: player.score,
    turn: player.turn ?? undefined,
  }));

  if (!(await checkUserOwns(player, input.nftId, dbConn))) {
    console.log('DISCARD: user does not own specified nft');
    return [];
  }

  const joinUpdates = persistLobbyJoin({
    lobby_id: input.lobbyID,
    nft_id: input.nftId,
  });
  lobbyPlayers.push({
    nftId: input.nftId,
    points: 0,
    score: 0,
    turn: undefined,
  });
  const isFull = rawPlayers.length + 1 >= lobby.max_players;

  const closeLobbyUpdates: SQLUpdate[] = isFull
    ? persistLobbyState({ lobby_id: input.lobbyID, lobby_state: 'closed' })
    : [];

  // Automatically activate a lobby when it fills up.
  // Note: this could be replaced by some input from creator.
  // TODO: even when doing it automatically, we should schedule it to avoid passing players in a weird way
  const activateLobbyUpdates: SQLUpdate[] = isFull
    ? persistStartMatch(
        input.lobbyID,
        matchEnvironment,
        lobbyPlayers,
        lobby.current_match,
        lobby.round_length,
        blockHeight,
        randomnessGenerator
      )
    : [];

  return [...joinUpdates, ...closeLobbyUpdates, ...activateLobbyUpdates];
};

// State transition when a close lobby input is processed
export const closedLobby = async (
  player: WalletAddress,
  input: ClosedLobbyInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (lobby == null) {
    console.log('DISCARD: lobby does not exist');
    return [];
  }

  if (!(await checkUserOwns(player, lobby.lobby_creator, dbConn))) {
    console.log('DISCARD: user does not own creator nft');
    return [];
  }

  const closeUpdates = persistLobbyState(lobby);

  return closeUpdates;
};

// State transition when a submit moves input is processed
export const submittedMoves = async (
  player: WalletAddress,
  blockHeight: number,
  input: SubmittedMovesInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  // Perform DB read queries to get needed data
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (!lobby) {
    console.log('DISCARD: lobby does not exist');
    return [];
  }
  if (!isLobbyWithStateProps(lobby)) {
    console.log('DISCARD: lobby does not have state properties');
    return [];
  }
  if (lobby.lobby_state !== 'active') {
    console.log('DISCARD: lobby not active');
    return [];
  }

  const players = await getLobbyPlayers.run({ lobby_id: input.lobbyID }, dbConn);
  if (players.length !== 2) {
    // TODO: allow for more than 2 players
    console.log(`DISCARD: wrong number of players ${players.length}`);
    return [];
  }

  if (player !== SCHEDULED_DATA_ADDRESS && !(await checkUserOwns(player, input.nftId, dbConn))) {
    console.log('DISCARD: user does not own specified nft');
    return [];
  }

  const [round] = await getRound.run(
    {
      lobby_id: lobby.lobby_id,
      match_within_lobby: input.matchWithinLobby,
      round_within_match: input.roundWithinMatch,
    },
    dbConn
  );
  const prandoSeed = await fetchPrandoSeed(lobby, dbConn);
  if (prandoSeed == null) {
    console.log('DISCARD: cannot fetch prando seed');
    return [];
  }

  // If the submitted moves are usable/all validation passes, continue
  if (!validateSubmittedMoves(lobby, players, round, input, new Prando(prandoSeed))) {
    console.log('DISCARD: invalid move');
    return [];
  }

  // Generate update to persist the moves
  const { sqlUpdates: moveUpdates, newMove } = persistMoveSubmission(input, lobby);
  // Execute the round and collect persist SQL updates
  const { sqlUpdates: roundExecutionTuples, newMatchState } = executeRound(
    blockHeight,
    lobby,
    players,
    [
      {
        // TODO: round executor doesn't need full move row, improve the type
        id: null as any,
        ...newMove,
      },
    ],
    round,
    new Prando(prandoSeed)
  );

  // If a bot goes next, schedule a bot move
  const botMoves = (() => {
    const newTurnPlayer = players.find(player => player.turn === newMatchState.turn);
    const newTurnNftId = newTurnPlayer?.nft_id;
    if (newTurnNftId !== PRACTICE_BOT_NFT_ID) return [];

    const practiceMoveSchedule = schedulePracticeMove(
      lobby.lobby_id,
      lobby.current_match,
      lobby.current_round + 1,
      blockHeight + 1
    );
    return [practiceMoveSchedule];
  })();

  console.log('New match state: ', newMatchState);
  return [...moveUpdates, ...roundExecutionTuples, ...botMoves];
};

// State transition when a practice moves input is processed
export const practiceMoves = async (
  player: WalletAddress,
  blockHeight: number,
  input: PracticeMovesInput,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  // Perform DB read queries to get needed data
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (!lobby || !isLobbyWithStateProps(lobby)) return [];
  const players = await getLobbyPlayers.run({ lobby_id: input.lobbyID }, dbConn);

  // note: do not try to give this Prando to submittedMoves, it has to create it again
  const prandoSeed = await fetchPrandoSeed(lobby, dbConn);
  if (prandoSeed == null) return [];

  const practiceAI = new PracticeAI(buildCurrentMatchState(lobby, players), new Prando(prandoSeed));
  const practiceMove = practiceAI.getNextMove();
  const regularInput: SubmittedMovesInput = {
    ...input,
    input: 'submittedMoves',
    nftId: PRACTICE_BOT_NFT_ID,
    rollAgain: practiceMove,
  };

  return submittedMoves(player, blockHeight, regularInput, dbConn);
};

// Validate submitted moves in relation to player/lobby/round state
function validateSubmittedMoves(
  lobby: LobbyWithStateProps,
  players: IGetLobbyPlayersResult[],
  round: IGetRoundResult,
  input: SubmittedMovesInput,
  randomnessGenerator: Prando
): boolean {
  // If lobby not active or existing
  if (!lobby || lobby.lobby_state !== 'active') {
    console.log('INVALID MOVE: lobby not active');
    return false;
  }

  // Player is supposed to play this turn
  const turnPlayer = players.find(player => player.turn === lobby.current_turn);
  const turnNft = turnPlayer?.nft_id;
  if (input.nftId !== turnNft) {
    console.log('INVALID MOVE: not players turn');
    return false;
  }

  // Verify fetched round exists
  if (!round) {
    console.log('INVALID MOVE: round does not exist');
    return false;
  }

  if (input.matchWithinLobby !== lobby.current_match) {
    console.log('INVALID MOVE: incorrect match');
    return false;
  }
  if (input.roundWithinMatch !== lobby.current_round) {
    console.log('INVALID MOVE: incorrect round');
    return false;
  }

  // If a move is sent that is invalid
  if (!isValidMove(randomnessGenerator, buildCurrentMatchState(lobby, players), input.rollAgain)) {
    console.log('INVALID MOVE: invalid move');
    return false;
  }

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
    return updateStats(input.nftId, input.result, dbConn);
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
  if (!isLobbyWithStateProps(lobby)) {
    console.log('DISCARD: lobby not active');
    return [];
  }

  const players = await getLobbyPlayers.run({ lobby_id: lobbyId }, dbConn);
  const [round] = await getRound.run(
    {
      lobby_id: lobby.lobby_id,
      match_within_lobby: lobby.current_match,
      round_within_match: lobby.current_round,
    },
    dbConn
  );

  // Note: Currently round === move, so this is always empty
  // (player did not submit any moves for this round yet because that would end it)
  // We're keeping it in case we add distinction between rounds and moves in the future.
  const moves = await getRoundMoves.run(
    {
      lobby_id: lobbyId,
      match_within_lobby: lobby.current_match,
      round_within_match: lobby.current_round,
    },
    dbConn
  );

  console.log(`Executing zombie round (#${lobby.current_round}) for lobby ${lobby.lobby_id}`);
  const { sqlUpdates: roundUpdates } = executeRound(
    blockHeight,
    lobby,
    players,
    moves,
    round,
    randomnessGenerator,
    true
  );

  return roundUpdates;
};

// State transition when an update stats input is processed
export const updateStats = async (
  nftId: number,
  result: ConciseResult,
  dbConn: Pool
): Promise<SQLUpdate[]> => {
  const [stats] = await getUserStats.run({ nft_id: nftId }, dbConn);
  // Verify coherency that the user has existing stats which can be updated
  if (stats) {
    const query = persistStatsUpdate(nftId, result, stats);
    console.log(query[1], `Updating stats of ${nftId}`);
    return [query];
  }
  return [];
};

// Runs the round executor and produces the necessary SQL updates as a result
export function executeRound(
  blockHeight: number,
  lobby: LobbyWithStateProps,
  players: IGetLobbyPlayersResult[],
  moves: IGetRoundMovesResult[],
  roundData: IGetRoundResult,
  randomnessGenerator: Prando,
  zombieRound?: boolean
): { sqlUpdates: SQLUpdate[]; newMatchState: MatchState } {
  if (zombieRound) {
    // TODO: implement zombie round
    // In blackjack dice, just move to next turn.
    throw new Error(`executeRound: not implemented`);
  }

  const matchEnvironment: MatchEnvironment = extractMatchEnvironment(lobby);
  // We initialize the round executor object and run it/get the new match state via `.endState()`
  const executor = initRoundExecutor(
    lobby,
    buildCurrentMatchState(lobby, players),
    moves,
    randomnessGenerator
  );
  const newMatchState = executor.endState();

  // We generate updates to the lobby to apply the new match state
  const lobbyUpdate = persistUpdateMatchState(
    lobby.lobby_id,
    matchEnvironment,
    newMatchState,
    blockHeight
  );

  // We generate updates for the executed round
  const executedRoundUpdate = persistExecutedRound(roundData, lobby, blockHeight);

  // Finalize match if game is over or we have reached the final round

  // TODO: Move to round round executor / persist match state
  //   and do not create new round if match ends.
  // Create a new round
  const newRoundUpdates = persistNewRound(
    lobby.lobby_id,
    lobby.current_match,
    lobby.current_round + 1,
    lobby.round_length,
    blockHeight
  );

  return {
    sqlUpdates: [...lobbyUpdate, ...executedRoundUpdate, ...newRoundUpdates],
    newMatchState,
  };
}

/**
 * We have to seed our own Prando, because we need to use randomness from
 * last round in the execution of current round.
 * Player throws dice, and then decides moves, i.e. dice throw has to be
 * decided before he decides and submits his moves.
 */
async function fetchPrandoSeed(
  lobby: LobbyWithStateProps,
  dbConn: Pool
): Promise<undefined | string> {
  const [match] = await getMatch.run(
    {
      lobby_id: lobby.lobby_id,
      match_within_lobby: lobby.current_match,
    },
    dbConn
  );
  const [lastRound] = await getRound.run(
    {
      lobby_id: lobby.lobby_id,
      match_within_lobby: lobby.current_match,
      round_within_match: lobby.current_round - 1,
    },
    dbConn
  );
  const seedBlockHeight =
    lobby.current_round === 0 ? match.starting_block_height : lastRound.execution_block_height;
  if (seedBlockHeight == null) return;
  const [seedBlock] = await getBlockHeights.run({ block_heights: [seedBlockHeight] }, dbConn);
  if (seedBlock == null) return;
  return seedBlock.seed;
}

async function checkUserOwns(user: WalletAddress, nftId: number, dbConn: Pool): Promise<boolean> {
  const walletNfts = await getOwnedNfts(dbConn, NFT_NAME, user);
  console.log('getOwnedNfts', walletNfts);

  return walletNfts.some(ownedNftId => Number(ownedNftId) === nftId);
}
