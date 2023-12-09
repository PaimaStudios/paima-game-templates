import type { CreatedLobbyInput } from '../types.js';
import type { IUpdateLobbyStateParams, ICreateLobbyParams } from '@dice/db';
import { createLobby, updateLobbyState } from '@dice/db';
import Prando from '@paima/sdk/prando';
import type { LobbyPlayer, LobbyStatus, MatchEnvironment } from '@dice/utils';
import { PRACTICE_BOT_NFT_ID } from '@dice/utils';
import { persistStartMatch } from './match.js';
import type { SQLUpdate } from '@paima/sdk/db';
import type { IJoinPlayerToLobbyParams } from '@dice/db/src/insert.queries.js';
import { joinPlayerToLobby } from '@dice/db/src/insert.queries.js';

// Persist creation of a lobby
export function persistLobbyCreation(
  nftId: number,
  blockHeight: number,
  inputData: CreatedLobbyInput,
  seed: string,
  randomnessGenerator: Prando
): SQLUpdate[] {
  const lobby_id = new Prando(seed).nextString(12);
  const lobbyPlayers: LobbyPlayer[] = [];

  // create the lobby
  const lobbyParams: ICreateLobbyParams = {
    lobby_id: lobby_id,
    // note: can be adjusted, but we don't have frontend for more
    max_players: 2,
    num_of_rounds: inputData.numOfRounds,
    round_length: inputData.roundLength,
    play_time_per_player: inputData.playTimePerPlayer,
    created_at: new Date(),
    creation_block_height: blockHeight,
    hidden: inputData.isHidden,
    practice: inputData.isPractice,
    lobby_creator: nftId,
    lobby_state: 'open' as LobbyStatus,
  };
  const createLobbyTuple: SQLUpdate = [createLobby, lobbyParams];

  // join creator to lobby
  const joinParams: IJoinPlayerToLobbyParams = {
    lobby_id,
    nft_id: nftId,
  };
  lobbyPlayers.push({
    nftId,
    points: 0,
    score: 0,
    turn: undefined,
  });
  const joinCreatorTuple: SQLUpdate = [joinPlayerToLobby, joinParams];

  // TODO: We reference players by nftId, so you can't have more than 1 bot
  const numBots = inputData.isPractice ? lobbyParams.max_players - lobbyPlayers.length : 0;
  const joinBots: SQLUpdate[] = Array(numBots)
    .fill(null)
    .flatMap(() => {
      lobbyPlayers.push({
        nftId: PRACTICE_BOT_NFT_ID,
        points: 0,
        score: 0,
        turn: undefined,
      });
      return persistLobbyJoin({
        lobby_id,
        nft_id: PRACTICE_BOT_NFT_ID,
      });
    });

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
        lobbyParams.round_length,
        blockHeight,
        randomnessGenerator
      );

  console.log(`Created lobby ${lobby_id}`);
  return [
    createLobbyTuple,
    joinCreatorTuple,
    ...joinBots,
    ...closeLobbyUpdates,
    ...activateLobbyUpdates,
  ];
}

export function persistLobbyJoin(params: IJoinPlayerToLobbyParams): SQLUpdate[] {
  return [[joinPlayerToLobby, params]];
}

export function persistLobbyState(params: IUpdateLobbyStateParams): SQLUpdate[] {
  return [[updateLobbyState, params]];
}
