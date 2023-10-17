import type { Pool } from 'pg';
import type {
  ICreateRoundParams,
  IGetLobbyGameStateResult,
  IUpdateLobbyGameStateParams,
  IUpdateLobbyToClosedParams,
} from '@hexbattle/db';
import {
  getLobbyLean,
  getLobbyPlayers,
  getLobbyRounds,
  createRound,
  updateLobbyGameState,
  getLobbyGameState,
  updateLobbyToClosed,
} from '@hexbattle/db';
import { createScheduledData, type SQLUpdate } from '@paima/sdk/db';
import type { SubmitMovesInput } from './types';
import type Prando from '@paima/sdk/prando';
import { Game, Moves } from '@hexbattle/engine';
import { ENV, type WalletAddress } from '@paima/sdk/utils';

export async function submitMoves(
  user: string,
  blockHeight: number,
  parsed: SubmitMovesInput,
  dbConn: Pool,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const [lobby] = await getLobbyLean.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobby) {
    console.log('Lobby does not exist');
    return [];
  }
  const lobbyPlayers = await getLobbyPlayers.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobbyPlayers.find(player => player.player_wallet === user)) {
    console.log('Wallet is not in game');
    return [];
  }

  if (lobby.lobby_state !== 'active') {
    console.log('Lobby is not active');
    return [];
  }

  const rounds = await getLobbyRounds.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (rounds.length !== parsed.roundNumber) {
    console.log('Round number is not correct');
    return [];
  }

  const [lobbyState] = await getLobbyGameState.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobbyState || !lobbyState.game_state) {
    console.log('Cannot fetch state');
    return [];
  }

  const game = validateMovesAndApply(user, parsed, lobbyState);
  if (!game) {
    console.log('Invalid move(s)');
    return [];
  }

  const sql: SQLUpdate[] = [];

  const roundParams: ICreateRoundParams = {
    block_height: blockHeight,
    lobby_id: parsed.lobbyID,
    move: JSON.stringify(parsed.move),
    round: parsed.roundNumber,
    wallet: user,
  };
  sql.push([createRound, roundParams]);

  const updateGameStateParams: IUpdateLobbyGameStateParams = {
    lobby_id: parsed.lobbyID,
    game_state: Game.export(game),
    current_round: game.turn,
  };
  sql.push([updateLobbyGameState, updateGameStateParams]);

  if (game.winner) {
    const closedParams: IUpdateLobbyToClosedParams = {
      lobby_id: parsed.lobbyID,
    };
    sql.push([updateLobbyToClosed, closedParams]);
  } else {
    sql.push(
      createScheduledData(`z|*${lobby.lobby_id}|${game.turn}`, blockHeight + 120 / ENV.BLOCK_TIME)
    );
  }
  return sql;
}

const validateMovesAndApply = (
  user: WalletAddress,
  parsed: SubmitMovesInput,
  lobby: IGetLobbyGameStateResult
): Game | null => {
  try {
    // Validate if move is legal.
    const game = Game.import(lobby.game_state);
    // parsed.move.forEach((rawMove, i) => {
    const move = Moves.deserializePaima(game, {
      move: JSON.stringify(parsed.move),
      round: parsed.roundNumber,
      wallet: user,
    });
    game.initMoves(move.player);
    for (const action of move.actions) {
      const player = game.players.find(p => p.wallet === user);

      if (!player) throw new Error('Player not found');
      if (game.getCurrentPlayer().wallet !== user) throw new Error('Not player turn');

      const originTile = game.map.tiles.find(t => t.same(action.origin));
      const targetTile = game.map.tiles.find(t => t.same(action.target));

      if (action.type === 'move') {
        if (!originTile || !targetTile) throw new Error('Tile not found');
        game.moveUnit(player, originTile, targetTile);
      } else if (action.type === 'new_unit') {
        if (!targetTile) throw new Error('Tile not found');
        if (!action.newUnitType) throw new Error('Unit type not found');
        game.placeUnit(player, targetTile, action.newUnitType);
      } else if (action.type === 'new_building') {
        if (!targetTile) throw new Error('Tile not found');
        if (!action.newBuildingType) throw new Error('Building type not found');
        game.placeBuilding(player, targetTile, action.newBuildingType);
      } else {
        throw new Error('Invalid action type');
      }
    }
    // });
    game.endTurn();

    return game;
  } catch (e) {
    console.log('Move is not valid');
    console.log(e);
    return null;
  }
};
