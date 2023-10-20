import type { Pool } from 'pg';
import Prando from '@paima/sdk/prando';
import { SCHEDULED_DATA_ADDRESS, type WalletAddress } from '@paima/sdk/utils';
import type { IGetLobbyPlayersResult, IGetRoundMovesResult } from '@cards/db';
import { getLobbyById, getUserStats, getLobbyPlayers, getOwnedNft } from '@cards/db';
import type { INewCardParams, INewTradeNftParams } from '@cards/db/src/insert.queries.js';
import { newCard, newTradeNft } from '@cards/db/src/insert.queries.js';
import type {
  LobbyWithStateProps,
  LobbyPlayer,
  MatchEnvironment,
  MatchState,
  Move,
} from '@cards/game-logic';
import {
  initRoundExecutor,
  buildCurrentMatchState,
  extractMatchEnvironment,
  isLobbyWithStateProps,
  serializeMove,
  deserializeMove,
  DECK_LENGTH,
  COMMITMENT_LENGTH,
  initialCurrentDeck,
  deserializeHandCard,
  MOVE_KIND,
  checkCommitment,
  deserializeBoardCard,
  deserializeLocalCard,
  genCardPack,
  INITIAL_HIT_POINTS,
} from '@cards/game-logic';
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
import { isValidMove } from '@cards/game-logic';
import type {
  ClosedLobbyInput,
  CreatedLobbyInput,
  GenericPaymentInput,
  JoinedLobbyInput,
  NftMintInput,
  PracticeMovesInput,
  SetTradeNftCardsInput,
  SubmittedMovesInput,
  TradeNftMintInput,
  TransferTradeNftInput,
  UserStatsInput,
  ZombieRoundInput,
} from './types.js';
import { CARD_PACK_PRICE, NFT_NAME, PRACTICE_BOT_NFT_ID } from '@cards/utils';
import { getBlockHeights, type SQLUpdate } from '@paima/sdk/db';
import { PracticeAI } from './persist/practice-ai';
import type { IGetRoundResult } from '@cards/db/src/select.queries';
import {
  checkOwnedCard,
  getMatch,
  getRound,
  getRoundMoves,
  getTradeNfts,
} from '@cards/db/src/select.queries';
import crypto from 'crypto';
import { newCardPack, type INewCardPackParams } from '@cards/db/src/insert.queries';
import type {
  IDeleteTradeNftParams,
  ISetTradeNftCardsParams,
  ITransferCardParams,
} from '@cards/db/src/update.queries';
import {
  deleteTradeNft,
  setTradeNftCards as setTradeNftCardsQuery,
  transferCard,
} from '@cards/db/src/update.queries';

// Create initial player entry after nft mint
export const mintNft = async (input: NftMintInput): Promise<SQLUpdate[]> => {
  try {
    return [blankStats(Number.parseInt(input.tokenId))];
  } catch (e) {
    console.log(`DISCARD: error in nft mint ${e}`);
    return [];
  }
};

// Create initial player entry after nft mint
export const mintTradeNft = async (input: TradeNftMintInput): Promise<SQLUpdate[]> => {
  try {
    const tradeNft = Number.parseInt(input.tokenId);
    const newTradeNftProps: INewTradeNftParams = {
      nft_id: tradeNft,
    };
    const newTradeNftUpdates: SQLUpdate[] = [[newTradeNft, newTradeNftProps]];

    return [...newTradeNftUpdates];
  } catch (e) {
    console.log(`DISCARD: error ${e}`);
    return [];
  }
};

export const cardPackBuy = async (
  input: GenericPaymentInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  if (CARD_PACK_PRICE.isGreaterThan(input.amount.toString())) {
    console.log('DISCARD: paid less than card pack price');
    return [];
  }

  const nft = await getOwnedNft(dbConn, NFT_NAME, input.payer);
  if (nft == null) {
    console.log('DISCARD: user does not own any nft');
    return [];
  }

  const newPackProps: INewCardPackParams = {
    buyer_nft_id: nft,
    card_registry_ids: genCardPack(randomnessGenerator),
  };
  const newPackUpdates: SQLUpdate[] = [[newCardPack, newPackProps]];

  const newCardUpdates: SQLUpdate[] = newPackProps.card_registry_ids.map(registry_id => {
    const newCardParams: INewCardParams = {
      owner_nft_id: nft,
      registry_id,
    };

    return [newCard, newCardParams];
  });

  return [...newPackUpdates, ...newCardUpdates];
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

  if (!(await validateStartingCommitments(input.creatorNftId, input.creatorCommitments, dbConn))) {
    console.log('DISCARD: invalid commitments');
    return [];
  }

  return persistLobbyCreation(blockHeight, input, block.seed, randomnessGenerator);
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
    hitPoints: player.hit_points,
    startingCommitments: player.starting_commitments,
    currentDeck: player.current_deck,
    currentHand: player.current_hand.map(deserializeHandCard),
    currentBoard: player.current_board.map(deserializeBoardCard),
    currentDraw: player.current_draw,
    currentResult: player.current_result ?? undefined,
    botLocalDeck: player.bot_local_deck?.map(deserializeLocalCard),
    turn: player.turn ?? undefined,
  }));

  if (!(await checkUserOwns(player, input.nftId, dbConn))) {
    console.log('DISCARD: user does not own specified nft');
    return [];
  }

  if (!(await validateStartingCommitments(input.nftId, input.commitments, dbConn))) {
    console.log('DISCARD: invalid commitments');
    return [];
  }

  const joinUpdates = persistLobbyJoin({
    lobby_id: input.lobbyID,
    nft_id: input.nftId,
    startingCommitments: input.commitments,
  });
  lobbyPlayers.push({
    nftId: input.nftId,
    hitPoints: INITIAL_HIT_POINTS,
    startingCommitments: input.commitments,
    currentDeck: initialCurrentDeck(),
    currentHand: [],
    currentBoard: [],
    currentDraw: 0,
    currentResult: undefined,
    botLocalDeck: undefined,
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
  if (
    !(await validateSubmittedMoves(lobby, players, round, input, dbConn, new Prando(prandoSeed)))
  ) {
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
    move: serializeMove(practiceMove),
  };

  return submittedMoves(player, blockHeight, regularInput, dbConn);
};

// Validate submitted moves in relation to player/lobby/round state
async function validateSubmittedMoves(
  lobby: LobbyWithStateProps,
  players: IGetLobbyPlayersResult[],
  round: IGetRoundResult,
  input: SubmittedMovesInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<boolean> {
  // If lobby not active or existing
  if (!lobby || lobby.lobby_state !== 'active') {
    console.log('INVALID MOVE: lobby not active');
    return false;
  }

  // Player is supposed to play this turn
  const turnPlayer = players.find(player => player.turn === lobby.current_turn);
  if (turnPlayer == null) {
    console.log('INTERNAL ERROR: no player for turn');
    return false;
  }

  const turnNft = turnPlayer.nft_id;
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

  let move: Move;
  try {
    move = deserializeMove(input.move);
    if (move.kind === MOVE_KIND.playCard) {
      if (
        !checkCommitment(
          crypto as any,
          turnPlayer.starting_commitments,
          move.cardIndex,
          move.salt,
          move.cardId
        )
      ) {
        console.log('INVALID MOVE: invalid commitment/reveal');
        return false;
      }
      const [ownedCard] = await checkOwnedCard.run(
        {
          owner_nft_id: turnPlayer.nft_id,
          id: move.cardId,
        },
        dbConn
      );
      if (turnPlayer.nft_id !== PRACTICE_BOT_NFT_ID && ownedCard == null) {
        console.log('INVALID MOVE: player does not own revealed card');
        return false;
      }
    }
  } catch (e) {
    console.log('INVALID MOVE: deserialize failed');
    return false;
  }

  // If a move is sent that is invalid
  if (!isValidMove(randomnessGenerator, buildCurrentMatchState(lobby, players), move)) {
    console.log('INVALID MOVE: invalid move');
    return false;
  }

  return true;
}

export async function setTradeNftCards(
  player: WalletAddress,
  input: SetTradeNftCardsInput,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  const nftId = await getOwnedNft(dbConn, NFT_NAME, player);
  if (nftId == null) {
    console.log('DISCARD: user does not own any nft');
    return [];
  }

  const [tradeNft] = await getTradeNfts.run({ nft_ids: [input.tradeNftId] }, dbConn);
  if (tradeNft == null) {
    console.log('DISCARD: trade nft not found');
    return [];
  }
  if (tradeNft.cards != null) {
    console.log('DISCARD: trade nft not empty');
    return [];
  }

  const checkOwns = await Promise.all(
    input.cards.map(card =>
      checkOwnedCard.run(
        {
          owner_nft_id: nftId,
          id: card,
        },
        dbConn
      )
    )
  );
  if (checkOwns.some(check => check.length === 0)) {
    console.log('DISCARD: user does not own all cards');
    return [];
  }

  const removeUserCardsUpdates: SQLUpdate[] = input.cards.map(card => {
    const transferParams: ITransferCardParams = {
      id: card,
      owner_nft_id: null,
    };
    return [transferCard, transferParams];
  });

  const setTradeNftCardsParams: ISetTradeNftCardsParams = {
    nft_id: input.tradeNftId,
    cards: input.cards,
  };
  const setTradeNftCardsUpdates: SQLUpdate[] = [[setTradeNftCardsQuery, setTradeNftCardsParams]];

  return [...removeUserCardsUpdates, ...setTradeNftCardsUpdates];
}

export async function claimTradeNftCards(
  input: TransferTradeNftInput,
  dbConn: Pool
): Promise<SQLUpdate[]> {
  const nftId = await getOwnedNft(dbConn, NFT_NAME, input.from);
  if (nftId == null) {
    console.log('DISCARD: user does not own any nft');
    return [];
  }

  const [tradeNft] = await getTradeNfts.run({ nft_ids: [input.tradeNftId] }, dbConn);
  if (tradeNft == null) {
    console.log('DISCARD: trade nft not found');
    return [];
  }
  if (tradeNft.cards == null || tradeNft.cards.length === 0) {
    console.log('DISCARD: trade nft empty');
    return [];
  }

  const addUserCardsUpdates: SQLUpdate[] = tradeNft.cards.map(card => {
    const transferParams: ITransferCardParams = {
      id: card,
      owner_nft_id: nftId,
    };
    return [transferCard, transferParams];
  });

  const deleteTradeNftParams: IDeleteTradeNftParams = {
    nft_id: input.tradeNftId,
  };
  const deleteTradeNftUpdates: SQLUpdate[] = [[deleteTradeNft, deleteTradeNftParams]];

  return [...addUserCardsUpdates, ...deleteTradeNftUpdates];
}

// State transition when a zombie round input is processed
export const zombieRound = async (
  blockHeight: number,
  input: ZombieRoundInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> => {
  const [lobby] = await getLobbyById.run({ lobby_id: input.lobbyID }, dbConn);
  if (!lobby) return [];
  if (!isLobbyWithStateProps(lobby)) {
    console.log('DISCARD: lobby not active');
    return [];
  }

  const players = await getLobbyPlayers.run({ lobby_id: input.lobbyID }, dbConn);
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
      lobby_id: input.lobbyID,
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
export const updateStats = async (input: UserStatsInput, dbConn: Pool): Promise<SQLUpdate[]> => {
  const [stats] = await getUserStats.run({ nft_id: input.nftId }, dbConn);
  // Verify coherency that the user has existing stats which can be updated
  if (stats) {
    const query = persistStatsUpdate(input.nftId, input.result, stats);
    console.log(query[1], `Updating stats of ${input.nftId}`);
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
    blockHeight
  );

  return {
    sqlUpdates: [...lobbyUpdate, ...executedRoundUpdate, ...newRoundUpdates],
    newMatchState,
  };
}

/**
 * We have to seed our own Prando, because we need to use randomness from
 * last round in the execution of current round (to calculate post-tx events).
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
  return (await getOwnedNft(dbConn, NFT_NAME, user)) === nftId;
}

async function validateStartingCommitments(
  _nftId: number,
  commitments: Uint8Array,
  _dbConn: Pool
): Promise<boolean> {
  if (commitments.length !== DECK_LENGTH * COMMITMENT_LENGTH) return false;
  return true;
}
