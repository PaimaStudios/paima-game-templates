import {Building, BuildingType} from './building';
import {Game} from './game';
import {Player} from './player.human';
import {Unit, UnitType} from './unit';

export class AIPlayer extends Player {
  constructor(playerId: string, gold: number) {
    super(playerId, gold, `AI-${(Math.random() * 10000) | 0}`);
    this.isHuman = false;
  }

  minMaxMove(game: Game) {
    const startTime = new Date().getTime();

    if (game.getCurrentPlayerId() !== this.id) {
      throw new Error("It's not my turn!");
    }

    // eslint-disable-next-line no-constant-condition
    while (1) {
      const moves = this.getAllMoves(game);
      if (!moves.length) break;

      const bestMove = moves.reduce(
        (best, move) => {
          const gameCopy = Game.import(Game.export(game));
          const playerCopy = gameCopy.getCurrentPlayer() as AIPlayer;
          if (move.type === 'build') {
            gameCopy.placeBuilding(
              playerCopy,
              gameCopy.map.tiles.find(t => t.same(move.place))!,
              move.building
            );
          }
          if (move.type === 'moveUnit') {
            gameCopy.moveUnit(
              playerCopy,
              gameCopy.map.tiles.find(t => t.same(move.unit))!,
              gameCopy.map.tiles.find(t => t.same(move.place))!
            );
          }
          if (move.type === 'placeUnit') {
            gameCopy.placeUnit(
              playerCopy,
              gameCopy.map.tiles.find(t => t.same(move.place))!,
              move.unit
            );
          }
          const score = playerCopy.minMaxScore(gameCopy);
          if (score > best.score) {
            return {move, score};
          }
          return best;
        },
        {move: moves[0], score: -Infinity}
      );
      const selectedMove = bestMove.move;
      if (selectedMove.type === 'build') {
        game.placeBuilding(
          this,
          game.map.tiles.find(t => t.same(bestMove.move.place))!,
          (bestMove.move as any).building
        );
      } else if (selectedMove.type === 'moveUnit') {
        game.moveUnit(
          this,
          game.map.tiles.find(t => t.same((bestMove.move as any).unit))!,
          game.map.tiles.find(t => t.same(bestMove.move.place))!
        );
      } else if (selectedMove.type === 'placeUnit') {
        game.placeUnit(
          this,
          game.map.tiles.find(t => t.same(bestMove.move.place))!,
          (bestMove.move as any).unit
        );
      }
    }

    const endTime = new Date().getTime();
    console.log('AI TIME', endTime - startTime, 'ms');

    game.endTurn();
  }

  private playerScore(game: Game, player: Player): number {
    const playerTiles = game.getMyTiles(player);
    let scoreUnits = 0;
    let scoreTowers = 0;
    let farmCount = 0;
    const scoreGoldPerTurn = player.goldPerRound(game.map);

    playerTiles.forEach(tile => {
      if (tile.unit) {
        scoreUnits += Unit.getPowerLevel(tile.unit.type) * 4;
      } else if (tile.building && tile.building.type === BuildingType.FARM) {
        farmCount += 1;
      } else if (tile.building && tile.building.type === BuildingType.TOWER) {
        scoreTowers += 3;
      } else if (tile.building && tile.building.type === BuildingType.TOWER2) {
        scoreTowers += 4;
      }
    });

    const score = scoreUnits + scoreTowers + scoreGoldPerTurn;

    return score;
  }

  private minMaxScore(game: Game): number {
    let globalScore = 0;
    const currentPlayer = game.getCurrentPlayer();
    for (let i = 0; i < game.players.length; i += 1) {
      if (game.players[i].id === currentPlayer.id) {
        if (game.players[i].alive) {
          globalScore += this.playerScore(game, game.players[i]);
        }
      } else {
        if (game.players[i].alive === false) globalScore += 1000;
        else globalScore -= 10 * this.playerScore(game, game.players[i]);
      }
    }
    return globalScore;
  }

  private getAllMoves(game: Game): (
    | {
        type: 'build';
        building: BuildingType;
        place: {q: number; r: number; s: number};
      }
    | {
        type: 'moveUnit';
        unit: {q: number; r: number; s: number};
        place: {q: number; r: number; s: number};
      }
    | {
        type: 'placeUnit';
        unit: UnitType;
        place: {q: number; r: number; s: number};
      }
  )[] {
    const units = game
      .getMyTiles(game.getCurrentPlayer())
      .filter(t => t.unit && t.unit.canMove);
    const moves: {
      type: 'moveUnit';
      unit: {q: number; r: number; s: number};
      place: {q: number; r: number; s: number};
    }[] = [];
    units.map(unit =>
      game.getUnitMovement(unit).map(place =>
        moves.push({
          type: 'moveUnit',
          unit: unit.getCoordinates(),
          place: place.getCoordinates(),
        })
      )
    );

    const gpt = game.getCurrentPlayer().goldPerRound(game.map);
    const placeUnits: {
      type: 'placeUnit';
      unit: UnitType;
      place: {q: number; r: number; s: number};
    }[] = [];
    [UnitType.UNIT_1, UnitType.UNIT_2, UnitType.UNIT_3, UnitType.UNIT_4]
      .filter(unit => game.getCurrentPlayer().gold >= Unit.getPrice(unit))
      .filter(unit => gpt + Unit.getMaintenancePrice(unit) >= 0)
      .forEach(unit => {
        const unitTiles = game.getNewUnitTiles(
          game.getCurrentPlayer(),
          UnitType.UNIT_1
        );
        unitTiles.forEach(place =>
          placeUnits.push({
            type: 'placeUnit',
            unit,
            place: place.getCoordinates(),
          })
        );
      });

    const buildingTiles = game.getBuildingTiles(game.getCurrentPlayer());
    const build: {
      type: 'build';
      building: BuildingType;
      place: {q: number; r: number; s: number};
    }[] = [];
    [BuildingType.FARM, BuildingType.TOWER, BuildingType.TOWER2]
      .filter(
        building => game.getCurrentPlayer().gold >= Building.getPrice(building)
      )
      .filter(building => gpt + Building.getMaintenancePrice(building) >= 0)
      .forEach(building =>
        buildingTiles.forEach(place =>
          build.push({
            type: 'build',
            building,
            place: place.getCoordinates(),
          })
        )
      );

    return [...moves, ...build, ...placeUnits];
  }

  // return array of moves and endturn.
  randomMove(game: Game) {
    if (game.getCurrentPlayerId() !== this.id) {
      throw new Error("It's not my turn!");
    }
    // eslint-disable-next-line no-constant-condition
    if (1) {
      this.minMaxMove(game);
      return;
    }

    // TODO THIS MIGHT NOT WORK ANYMORE. GOLD PER TURN IS NOT CALCULATED.
    while (game.currentPlayerHasMoves()) {
      try {
        const unitTile = game
          .getMyTiles(this)
          .find(
            tile => tile.unit && tile.unit.canMove && tile.owner?.id === this.id
          );
        const moves = unitTile ? game.getUnitMovement(unitTile) : [];
        const buildingTiles = game.getBuildingTiles(this);
        const unitTiles = game.getNewUnitTiles(this, UnitType.UNIT_1);
        if (unitTile && moves.length) {
          const priority0 = moves.filter(
            m => m.owner?.id === this.id && m.building
          );
          if (priority0.length) {
            const move =
              priority0[Math.floor(Math.random() * priority0.length)];
            game.moveUnit(this, unitTile, move);
            continue;
          }
          const priority1 = moves.filter(m => m.owner?.id !== this.id);
          if (priority1.length) {
            const move =
              priority1[Math.floor(Math.random() * priority1.length)];
            game.moveUnit(this, unitTile, move);
            continue;
          }
          const priority2 = moves.filter(m => !m.owner);
          if (priority2.length) {
            const move =
              priority2[Math.floor(Math.random() * priority2.length)];
            game.moveUnit(this, unitTile, move);
            continue;
          }
          const move = moves[Math.floor(Math.random() * moves.length)];
          game.moveUnit(this, unitTile, move);
          continue;
        } else if (
          buildingTiles.length &&
          this.gold >= Building.getPrice(BuildingType.FARM)
        ) {
          const tile =
            buildingTiles[Math.floor(Math.random() * buildingTiles.length)];
          game.placeBuilding(this, tile, BuildingType.FARM);
          continue;
        } else if (
          unitTiles.length &&
          this.gold >= Unit.getPrice(UnitType.UNIT_1)
        ) {
          const priority0 = unitTiles.filter(t => !t.owner);
          if (priority0.length) {
            const tile =
              priority0[Math.floor(Math.random() * priority0.length)];
            game.placeUnit(this, tile, UnitType.UNIT_1);
            continue;
          }
          const tile = unitTiles[Math.floor(Math.random() * unitTiles.length)];
          game.placeUnit(this, tile, UnitType.UNIT_1);
          continue;
        }
        throw new Error('No moves?');
      } catch (e) {
        console.log('AI ERROR', e);
        break;
      }
    }
    game.endTurn();
  }
}
