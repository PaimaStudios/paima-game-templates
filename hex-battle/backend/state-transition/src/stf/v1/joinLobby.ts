import type { Pool } from 'pg';
import type {
  IAddPlayerToLobbyParams,
  ICreatePlayerParams,
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
import Prando from '@paima/sdk/prando';
import type { JoinLobbyInput } from './types';
import type { UnitType, BuildingType } from '@hexbattle/engine';
import { Tile, GameMap, Player, Game, Building, Unit } from '@hexbattle/engine';
import { ENV } from '@paima/sdk/utils';

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

    // last player joined
    if (lobbyPlayers.length + 1 === lobby.num_of_players) {
      // At first round create game.
      /**
       *  IMPORTANT
       *  KEEP IN SYNC WITH pregame_screen.ts
       */

      // create new game
      const initalGold = lobby!.gold;
      const validIds = ['A', 'B', 'C', 'D', 'E'];
      const tiles = JSON.parse(lobbyMap.map!)
        .map((coord: { q: number; r: number; s: number }) => {
          if (
            coord.q !== parseInt(String(coord.q), 10) ||
            coord.r !== parseInt(String(coord.r), 10) ||
            coord.s !== parseInt(String(coord.s), 10)
          ) {
            console.log('WTF Invalid tile', coord);
            return null;
          }

          return new Tile(coord.q, coord.r, coord.s);
        })
        .filter((x: Tile | null) => !!x);
      const map = new GameMap(tiles);
      map.updateLimits();
      const players = [...lobbyPlayers, addPlayerToLobbyParams].map(
        (p, i) => new Player(validIds[i], initalGold, p.player_wallet)
      );

      const game = new MapPlayerGame(
        lobby.lobby_id,
        user,
        map,
        players,
        lobby.units!.split('') as UnitType[],
        lobby.buildings!.split('') as BuildingType[],
        lobby.init_tiles!,
        blockHeight
      );

      const updateStateParams: IUpdateLobbyGameStateParams = {
        current_round: 0,
        game_state: Game.export(game) as any,
        lobby_id: parsed.lobbyID,
      };
      returnSQL.push([updateLobbyGameState, updateStateParams]);

      const update: IUpdateLobbyToActiveParams = {
        lobby_id: parsed.lobbyID,
        started_block_height: blockHeight,
      };
      returnSQL.push([updateLobbyToActive, update]);

      // Create next zombie scheduled data
      const lobbyId = lobby.lobby_id;
      const turn = 0;
      const count = 0;
      const time = blockHeight + 120 / ENV.BLOCK_TIME;

      returnSQL.push(createScheduledData(`z|*${lobbyId}|${turn}|${count}`, time));
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

class MapPlayerGame extends Game {
  constructor(
    lobbyId: string,
    localWallet: string,
    map: GameMap,
    _players: Player[],
    initialUnitsTypes: UnitType[],
    initialBuildingsTypes: BuildingType[],
    initalNumberOfTitlesPerPlayer: number,
    startBlockHeight: number
  ) {
    let retries = 10000;
    const rand = new Prando(lobbyId);
    const players = _players
      .map(value => ({ value, sort: rand.nextInt(0, 10000) }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    const units: Unit[] = [];
    const buildings: Building[] = [];
    for (const player of players) {
      let initialTile: Tile | undefined;
      while (!initialTile || initialTile.owner) {
        initialTile = map.tiles[rand.nextInt(0, map.tiles.length - 1)];
        retries--;
        if (retries < 0) throw new Error('Too many retries');
      }
      initialTile.owner = player;

      const playerTiles = [initialTile];

      for (let i = 0; i < initalNumberOfTitlesPerPlayer; i++) {
        let tile: Tile | undefined;
        while (!tile || tile.owner) {
          tile = map.getTileFrom(
            playerTiles[rand.nextInt(0, playerTiles.length - 1)],
            rand.nextInt(0, 5)
          );
          retries--;
          if (retries < 0) throw new Error('Too many retries');
        }
        tile.owner = player;
        playerTiles.push(tile);
      }

      for (const type of initialBuildingsTypes) {
        let tile: Tile | undefined;
        while (!tile || tile.building || tile.unit) {
          tile = playerTiles[rand.nextInt(0, playerTiles.length - 1)];
          retries--;
          if (retries < 0) throw new Error('Too many retries');
        }
        const b = new Building(player, type);
        tile.building = b;
        buildings.push(b);
      }

      for (const type of initialUnitsTypes) {
        let tile: Tile | undefined;
        while (!tile || tile.building || tile.unit) {
          tile = playerTiles[rand.nextInt(0, playerTiles.length - 1)];
          retries--;
          if (retries < 0) throw new Error('Too many retries');
        }

        const u = new Unit(player, type, Unit.generateUnitId(-1, tile.getCoordinates()));
        u.canMove = true;
        tile.unit = u;
        units.push(u);
      }
    }
    super(lobbyId, map, players, localWallet, startBlockHeight);
  }
}
