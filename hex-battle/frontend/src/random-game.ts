import {
  Game,
  UnitType,
  BuildingType,
  GameMap,
  Player,
  AIPlayer,
  Unit,
  Building,
  Tile,
} from '@hexbattle/engine';

export class RandomGame extends Game {
  constructor(
    lobbyId: string,
    localWallet: string,
    humanPlayers: number,
    AIPlayers: number,
    size: 'small' | 'medium' | 'large',
    initialUnitsTypes: UnitType[],
    initialBuildingsTypes: BuildingType[],
    initalNumberOfTitlesPerPlayer: number,
    initalGold = 10,
    glitch = 0.1
  ) {
    const numberOfPlayers = humanPlayers + AIPlayers;

    const numberOftiles =
      numberOfPlayers * initalNumberOfTitlesPerPlayer +
      numberOfPlayers * (size === 'small' ? 5 : size === 'medium' ? 15 : 25);

    // TODO update coordinates when adding tiles.
    // TODO check if tiles are connected.
    const map = GameMap.RingMap(numberOftiles);
    const mapB = GameMap.RingMap(numberOftiles);
    mapB.tiles.forEach(t => {
      t.q += map.maxQ;
      t.s -= map.maxQ;
      t.q += map.maxS;
      t.r -= map.maxS;
    });

    mapB.tiles.forEach(t => {
      if (!map.tiles.find(x => x.same(t))) {
        map.tiles.push(t);
      }
    });
    map.updateLimits();

    for (let i = map.tiles.length - 1; i >= 0; i -= 1) {
      if (Math.random() < glitch) {
        map.tiles.splice(i, 1);
        // TODO RECONNECT ISLANDS
      }
    }

    const playerIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const players = [
      ...new Array(humanPlayers)
        .fill(0)
        .map((_, i) => new Player(playerIndex[i], initalGold, playerIndex[i])),
      ...new Array(AIPlayers)
        .fill(0)
        .map((_, i) => new AIPlayer(playerIndex[humanPlayers + i], initalGold)),
    ]
      .map(value => ({value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value);

    const units: Unit[] = [];
    const buildings: Building[] = [];
    for (const player of players) {
      let initialTile: Tile | undefined;
      while (!initialTile || initialTile.owner) {
        initialTile = map.tiles[Math.floor(Math.random() * map.tiles.length)];
      }
      initialTile.owner = player;

      const playerTiles = [initialTile];

      for (let i = 0; i < initalNumberOfTitlesPerPlayer; i++) {
        let tile: Tile | undefined;
        while (!tile || tile.owner) {
          tile = map.getTileFrom(
            playerTiles[Math.floor(Math.random() * playerTiles.length)],
            Math.floor(Math.random() * 6)
          );
        }
        tile.owner = player;
        playerTiles.push(tile);
      }

      for (const type of initialBuildingsTypes) {
        let tile: Tile | undefined;
        while (!tile || tile.building || tile.unit) {
          const index = Math.floor(Math.random() * playerTiles.length);
          tile = playerTiles[index];
        }
        const b = new Building(player, type);
        tile.building = b;
        buildings.push(b);
      }

      for (const type of initialUnitsTypes) {
        let tile: Tile | undefined;
        while (!tile || tile.building || tile.unit) {
          const index = Math.floor(Math.random() * playerTiles.length);
          tile = playerTiles[index];
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

    super(lobbyId, map, players, localWallet, 0);
  }
}
