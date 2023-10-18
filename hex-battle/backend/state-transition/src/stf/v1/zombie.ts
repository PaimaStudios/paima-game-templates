import type {
  ICreateRoundParams,
  IUpdateLobbyGameStateParams,
  IUpdateLobbyToClosedParams,
  IUpdatePlayerDrawParams,
} from '@hexbattle/db';
import {
  createRound,
  getLobbyGameState,
  getLobbyLean,
  updateLobbyGameState,
  updateLobbyToClosed,
  updatePlayerDraw,
} from '@hexbattle/db';
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

  console.log('Zombie scheduled data: ' + JSON.stringify(parsed));

  if (parsed.count > 5) {
    // END GAME
    const game = Game.import(lobbyState.game_state);
    const closedParams: IUpdateLobbyToClosedParams = {
      lobby_id: parsed.lobbyID,
    };
    sql.push([updateLobbyToClosed, closedParams]);
    for (const player of game.players) {
      const drawParams: IUpdatePlayerDrawParams = {
        last_block_height: blockHeight,
        wallet: player.wallet,
      };
      const drawQuery: SQLUpdate = [updatePlayerDraw, drawParams];
      sql.push(drawQuery);
    }
  } else {
    // SKIP TURN
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

    // Create next zombie scheduled data
    const lobbyId = lobby.lobby_id;
    const turn = game.turn;
    const count = parsed.count + 1;
    const time = blockHeight + 120 / ENV.BLOCK_TIME;
    sql.push(createScheduledData(`z|*${lobbyId}|${turn}|${count}`, time));
  }

  return sql;
}
