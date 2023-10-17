import {
  Game,
  GameMap,
  Player,
  UnitType,
  BuildingType,
  Unit,
  Building,
  Tile,
} from '@hexbattle/engine';
import * as mw from './paima/middleware';

export class MapPlayerGame extends Game {
  constructor(
    lobbyId: string,
    localWallet: string,
    map: GameMap,
    _players: Player[],
    initialUnitsTypes: UnitType[],
    initialBuildingsTypes: BuildingType[],
    initalNumberOfTitlesPerPlayer: number,
    initialBlockHeight: number
  ) {
    const rand = new mw.prando(lobbyId);
    const players = _players
      .map(value => ({value, sort: rand.nextInt(0, 10000)}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value);

    const units: Unit[] = [];
    const buildings: Building[] = [];
    for (const player of players) {
      let initialTile: Tile | undefined;
      while (!initialTile || initialTile.owner) {
        initialTile = map.tiles[rand.nextInt(0, map.tiles.length - 1)];
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
        }
        tile.owner = player;
        playerTiles.push(tile);
      }

      for (const type of initialBuildingsTypes) {
        let tile: Tile | undefined;
        while (!tile || tile.building || tile.unit) {
          tile = playerTiles[rand.nextInt(0, playerTiles.length - 1)];
        }
        const b = new Building(player, type);
        tile.building = b;
        buildings.push(b);
      }

      for (const type of initialUnitsTypes) {
        let tile: Tile | undefined;
        while (!tile || tile.building || tile.unit) {
          tile = playerTiles[rand.nextInt(0, playerTiles.length - 1)];
        }

        const u = new Unit(
          player,
          type,
          Unit.generateUnitId(-1, tile.getCoordinates())
        );
        u.canMove = true;
        tile.unit = u;
        units.push(u);
      }
    }
    super(lobbyId, map, players, localWallet, initialBlockHeight);
  }
}
