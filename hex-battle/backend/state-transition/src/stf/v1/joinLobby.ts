import type { Pool } from 'pg';
import type {
  IAddPlayerToLobbyParams,
  ICreatePlayerParams,
  IGetLobbyLeanResult,
  IGetLobbyMapResult,
  IUpdateLobbyGameStateParams,
  IUpdateLobbyToActiveParams,
} from '@hexbattle/db';
import {
  getLobbyLean,
  getLobbyPlayers,
  addPlayerToLobby,
  updateLobbyToActive,
  updateLobbyGameState,
  getLobbyMap,
  createPlayer,
  getPlayerByWallet,
} from '@hexbattle/db';
import { createScheduledData, type SQLUpdate } from '@paima/sdk/db';
import type { JoinLobbyInput } from './types';
import type { UnitType, BuildingType } from '@hexbattle/engine';
import { Tile, GameMap, Player, Game, CreateGame } from '@hexbattle/engine';
import { ENV } from '@paima/sdk/utils';
import type Prando from '@paima/sdk/prando';

export async function joinLobby(
  user: string,
  blockHeight: number,
  parsed: JoinLobbyInput,
  dbConn: Pool,
  randomnessGenerator: Prando
): Promise<SQLUpdate[]> {
  const [lobby] = await getLobbyLean.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobby) {
    console.log('Lobby does not exist');
    return [];
  }

  const lobbyPlayers = await getLobbyPlayers.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (lobbyPlayers.find(player => player.player_wallet === user)) {
    console.log('Lobby already joined');
    return [];
  }

  if (lobbyPlayers.length >= lobby.num_of_players) {
    console.log('Lobby is full');
    return [];
  }

  if (lobby.lobby_state !== 'open') {
    console.log('Lobby is not open');
    return [];
  }

  const [lobbyMap] = await getLobbyMap.run({ lobby_id: parsed.lobbyID }, dbConn);
  if (!lobbyMap || !lobbyMap.map) {
    console.log('Cannot fetch map');
    return [];
  }

  const returnSQL: SQLUpdate[] = [];

  try {
    const addPlayerToLobbyParams: IAddPlayerToLobbyParams = {
      lobby_id: parsed.lobbyID,
      player_wallet: user,
    };
    const addPlayerToLobbySQL: SQLUpdate = [addPlayerToLobby, addPlayerToLobbyParams];
    returnSQL.push(addPlayerToLobbySQL);

    // Last player joined game.
    if (lobbyPlayers.length + 1 === lobby.num_of_players) {
      const initalGold = lobby!.gold;
      const players = [...lobbyPlayers, addPlayerToLobbyParams].map(
        (p, i) => new Player(Player.PlayerIndexes[i], initalGold, p.player_wallet)
      );
      returnSQL.push(...startGame(lobby, lobbyMap, players, blockHeight, randomnessGenerator));
    }

    // leaderboard
    const [player] = await getPlayerByWallet.run({ wallet: user }, dbConn);
    if (!player) {
      const createPlayerParams: ICreatePlayerParams = {
        block_height: blockHeight,
        wallet: user,
      };
      const addPlayerToSQL: SQLUpdate = [createPlayer, createPlayerParams];
      returnSQL.push(addPlayerToSQL);
    }

    return returnSQL;
  } catch (e) {
    console.log('ERROR @ JOIN LOBBY');
    console.log(e);
    return [];
  }
}

function startGame(
  lobby: IGetLobbyLeanResult,
  lobbyMap: IGetLobbyMapResult,
  players: Player[],
  blockHeight: number,
  randomnessGenerator: Prando
): SQLUpdate[] {
  const returnSQL: SQLUpdate[] = [];

  // Build map from lobby data.
  const tiles = JSON.parse(lobbyMap.map!)
    .map((coord: { q: number; r: number; s: number }) => {
      if (
        coord.q !== parseInt(String(coord.q), 10) ||
        coord.r !== parseInt(String(coord.r), 10) ||
        coord.s !== parseInt(String(coord.s), 10)
      ) {
        console.log('Invalid tile', coord);
        return null;
      }

      return new Tile(coord.q, coord.r, coord.s);
    })
    .filter((x: Tile | null) => !!x);
  const map = new GameMap(tiles);
  map.updateLimits();

  // Create new game.
  const game = CreateGame.newGame(
    lobby.lobby_id,
    '',
    map,
    players,
    lobby.units!.split('') as UnitType[],
    lobby.buildings!.split('') as BuildingType[],
    lobby.init_tiles!,
    blockHeight,
    randomnessGenerator
  );

  const updateStateParams: IUpdateLobbyGameStateParams = {
    current_round: 0,
    game_state: Game.export(game) as any,
    lobby_id: lobby.lobby_id,
  };
  returnSQL.push([updateLobbyGameState, updateStateParams]);

  const update: IUpdateLobbyToActiveParams = {
    lobby_id: lobby.lobby_id,
    started_block_height: blockHeight,
    seed: String(randomnessGenerator._seed),
  };
  returnSQL.push([updateLobbyToActive, update]);

  // Create next zombie scheduled data
  const lobbyId = lobby.lobby_id;
  const turn = 0;
  const count = 0;
  const time = blockHeight + 120 / ENV.BLOCK_TIME;

  returnSQL.push(createScheduledData(`z|*${lobbyId}|${turn}|${count}`, time));
  return returnSQL;
}
