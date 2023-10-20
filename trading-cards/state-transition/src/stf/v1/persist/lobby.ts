import type { CreatedLobbyInput } from '../types.js';
import type { IUpdateLobbyStateParams, ICreateLobbyParams } from '@cards/db';
import { createLobby, updateLobbyState } from '@cards/db';
import Prando from '@paima/sdk/prando';
import type { LobbyPlayer, LobbyStatus, LocalCard, MatchEnvironment } from '@cards/game-logic';
import {
  INITIAL_HIT_POINTS,
  genBotDeck,
  genCommitments,
  initialCurrentDeck,
  serializeLocalCard,
} from '@cards/game-logic';
import { persistStartMatch } from './match.js';
import type { SQLUpdate } from '@paima/sdk/db';
import type { IJoinPlayerToLobbyParams } from '@cards/db/src/insert.queries.js';
import { joinPlayerToLobby } from '@cards/db/src/insert.queries.js';
import { PRACTICE_BOT_NFT_ID } from '@cards/utils';
import crypto from 'crypto';

// Persist creation of a lobby
export async function persistLobbyCreation(
  blockHeight: number,
  inputData: CreatedLobbyInput,
  seed: string,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const lobby_id = new Prando(seed).nextString(12);
  const lobbyPlayers: LobbyPlayer[] = [];

  // create the lobby
  const lobbyParams: ICreateLobbyParams = {
    lobby_id: lobby_id,
    // note: can be adjusted, but we don't have frontend for more
    max_players: 2,
    num_of_rounds: inputData.numOfRounds,
    turn_length: inputData.turnLength,
    created_at: new Date(),
    creation_block_height: blockHeight,
    hidden: inputData.isHidden,
    practice: inputData.isPractice,
    lobby_creator: inputData.creatorNftId,
    lobby_state: 'open' as LobbyStatus,
  };
  const createLobbyTuple: SQLUpdate = [createLobby, lobbyParams];

  // join creator to lobby
  lobbyPlayers.push({
    nftId: inputData.creatorNftId,
    hitPoints: INITIAL_HIT_POINTS,
    startingCommitments: inputData.creatorCommitments,
    currentDeck: initialCurrentDeck(),
    currentHand: [],
    currentBoard: [],
    currentDraw: 0,
    currentResult: undefined,
    botLocalDeck: undefined,
    turn: undefined,
  });
  const joinCreatorUpdates = persistLobbyJoin({
    lobby_id,
    nft_id: inputData.creatorNftId,
    startingCommitments: inputData.creatorCommitments,
  });

  // TODO: We reference players by nftId, so you can't have more than 1 bot
  const numBots = inputData.isPractice ? lobbyParams.max_players - lobbyPlayers.length : 0;
  const joinBots: SQLUpdate[] = (
    await Promise.all(
      Array(numBots)
        .fill(null)
        .map(async () => {
          const botDeck = genBotDeck(randomnessGenerator);
          const commitments = await genCommitments(crypto as any, botDeck);
          const localDeck: LocalCard[] = botDeck.map((registryId, i) => ({
            id: 0, // won't be checked for a bot
            registryId,
            salt: commitments.salt[i],
          }));

          lobbyPlayers.push({
            nftId: PRACTICE_BOT_NFT_ID,
            hitPoints: INITIAL_HIT_POINTS,
            startingCommitments: commitments.commitments,
            currentDeck: initialCurrentDeck(),
            currentHand: [],
            currentBoard: [],
            currentDraw: 0,
            currentResult: undefined,
            botLocalDeck: localDeck,
            turn: undefined,
          });
          return persistLobbyJoin({
            lobby_id,
            nft_id: PRACTICE_BOT_NFT_ID,
            startingCommitments: commitments.commitments,
            botLocalDeck: localDeck.map(serializeLocalCard),
          });
        })
    )
  ).flat();

  const closeLobbyUpdates: SQLUpdate[] =
    lobbyPlayers.length < lobbyParams.max_players
      ? []
      : persistLobbyState({ lobby_id, lobby_state: 'closed' });

  const matchEnvironment: MatchEnvironment = {
    practice: lobbyParams.practice,
    numberOfRounds: lobbyParams.num_of_rounds,
  };
  // Automatically activate a lobby when it fills up.
  // Note: This could be replaced by some input from creator.
  const activateLobbyUpdates: SQLUpdate[] =
    lobbyPlayers.length < lobbyParams.max_players
      ? []
      : persistStartMatch(
          lobby_id,
          matchEnvironment,
          lobbyPlayers,
          null,
          blockHeight,
          randomnessGenerator
        );

  console.log(`Created lobby ${lobby_id}`);
  return [
    createLobbyTuple,
    ...joinCreatorUpdates,
    ...joinBots,
    ...closeLobbyUpdates,
    ...activateLobbyUpdates,
  ];
}

export type IJoinPlayerToLobbyRequest = {
  lobby_id: IJoinPlayerToLobbyParams['lobby_id'];
  nft_id: IJoinPlayerToLobbyParams['nft_id'];
  startingCommitments: Uint8Array;
  botLocalDeck?: IJoinPlayerToLobbyParams['bot_local_deck'];
};
export function persistLobbyJoin(req: IJoinPlayerToLobbyRequest): SQLUpdate[] {
  const params: IJoinPlayerToLobbyParams = {
    lobby_id: req.lobby_id,
    nft_id: req.nft_id,
    hit_points: INITIAL_HIT_POINTS,
    starting_commitments: Buffer.from(req.startingCommitments),
    current_deck: initialCurrentDeck(),
    bot_local_deck: req.botLocalDeck ?? null,
  };

  return [[joinPlayerToLobby, params]];
}

export function persistLobbyState(params: IUpdateLobbyStateParams): SQLUpdate[] {
  return [[updateLobbyState, params]];
}
