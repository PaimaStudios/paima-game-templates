import type { ICreateRoundParams, IUpdateLobbyGameStateParams } from '@hexbattle/db';
import { createRound, getLobbyGameState, getLobbyLean, updateLobbyGameState } from '@hexbattle/db';
import { createScheduledData, type SQLUpdate } from '@paima/sdk/db';
import type Prando from '@paima/sdk/prando';
import type { Pool } from 'pg';
import type { ZombieScheduledInput } from './types';
import { ENV } from '@paima/sdk/utils';
import { Game, Moves } from '@hexbattle/engine';

export async function zombieScheduledData(
  _: string,
  blockHeight: number,
  parsed: ZombieScheduledInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const sql: SQLUpdate[] = [];
  const [lobby] = await getLobbyLean.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobby) {
    console.log('Lobby does not exist');
    return [];
  }
  const [lobbyState] = await getLobbyGameState.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobbyState || !lobbyState.game_state) {
    console.log('Cannot fetch state');
    return [];
  }

  if (lobby.current_round !== parsed.roundNumber) {
    // discard zombie move, user has played.
    return [];
  }

  if (lobby.lobby_state !== 'active') {
    console.log('Lobby is not active');
    return [];
  }

  console.log('Zombie scheduled data: ' + parsed);

  const game = Game.import(lobbyState.game_state);
  const skippedPlayerWallet = game.getCurrentPlayer().wallet;
  const move = Moves.deserializePaima(game, {
    move: JSON.stringify([]),
    round: parsed.roundNumber,
    wallet: skippedPlayerWallet,
  });
  game.initMoves(move.player);
  game.endTurn();

  const roundParams: ICreateRoundParams = {
    block_height: blockHeight,
    lobby_id: parsed.lobbyID,
    move: JSON.stringify([]),
    round: parsed.roundNumber,
    wallet: skippedPlayerWallet,
  };
  sql.push([createRound, roundParams]);

  const updateGameStateParams: IUpdateLobbyGameStateParams = {
    lobby_id: parsed.lobbyID,
    game_state: Game.export(game),
    current_round: game.turn,
  };
  sql.push([updateLobbyGameState, updateGameStateParams]);

  // Create
  sql.push(
    createScheduledData(`z|*${lobby.lobby_id}|${game.turn}`, blockHeight + 120 / ENV.BLOCK_TIME)
  );

  return sql;
}
