import {BuildingType, Building} from './building';
import {Game} from './game';
import {Player} from './player.human';
import {Tile} from './tile';
import {UnitType, Unit} from './unit';

type GameActionType = 'move' | 'new_unit' | 'new_building' | 'gold';

export class GameAction {
  public updates: Tile[] = [];
  public original: Tile[] = [];

  public goldDelta = 0;
  public unitMoved: number | null = null;
  public defeat_target: string | null = null;
  public newUnitType: UnitType | null = null;
  public newBuildingType: BuildingType | null = null;

  constructor(
    public type: GameActionType,
    public target: {q: number; r: number; s: number},
    public origin: {q: number; r: number; s: number} | null = null
  ) {}

  setTile(tile: Tile): number {
    this.original.push(tile.copyTile());
    this.updates.push(tile.copyTile());
    return this.original.length - 1;
  }
}

export class Moves {
  public actions: GameAction[];
  constructor(
    public player: Player,
    public turn: number
  ) {
    this.actions = [];
  }

  public applyUndo(game: Game, action: GameAction) {
    this.player.gold -= action.goldDelta;

    if (action.defeat_target) {
      game.players.find(p => p.id === action.defeat_target)!.alive = true;
    }

    for (const original of action.original) {
      for (let i = 0; i < game.map.tiles.length; i++) {
        if (game.map.tiles[i].same(original)) {
          game.map.tiles[i] = original;
          break;
        }
      }
    }

    if (action.unitMoved) {
      const unitTile = game.map.tiles.find(
        t => t.unit && t.unit.id === action.unitMoved
      );
      unitTile!.unit!.canMove = true;
    }
  }

  private applyEffects(game: Game, action: GameAction) {
    this.player.gold += action.goldDelta;

    if (action.defeat_target) {
      game.players.find(p => p.id === action.defeat_target)!.alive = false;
    }

    for (const update of action.updates) {
      for (let i = 0; i < game.map.tiles.length; i++) {
        if (game.map.tiles[i].same(update)) {
          game.map.tiles[i] = update;
          break;
        }
      }
    }

    if (action.unitMoved) {
      const unitTile = game.map.tiles.find(
        t => t.unit && t.unit.id === action.unitMoved
      );
      unitTile!.unit!.canMove = false;
    }
  }

  private defeatPlayer(
    game: Game,
    action: GameAction,
    defeatedPlayerId: string,
    skipTile: {q: number; r: number; s: number} | undefined
  ) {
    action.defeat_target = defeatedPlayerId;
    game.map.tiles
      .filter(t => {
        if (
          skipTile &&
          t.q === skipTile.q &&
          t.r === skipTile.r &&
          t.s === skipTile.s
        ) {
          return false;
        }

        return t.owner && t.owner?.id === defeatedPlayerId;
      })
      .forEach(t => {
        const index = action.setTile(t);
        action.updates[index].owner = null;
        action.updates[index].unit = null;
        action.updates[index].building = null;
      });
  }

  private attack(game: Game, action: GameAction, unit: Unit) {
    const newTarget = action.updates[0];
    const newOrigin = action.updates[1];
    const oldTarget = action.original[0];
    // const oldOrigin = action.original[1];

    if (!newTarget || !oldTarget) {
      throw new Error('CRITIAL ERROR. Invalid target');
    }

    newTarget.unit = unit;
    newTarget.owner = this.player;
    if (newOrigin) newOrigin.unit = null;

    const isAttack = oldTarget.owner && oldTarget.owner.id !== this.player.id;

    if (isAttack) {
      if (oldTarget.building?.type === BuildingType.BASE) {
        this.defeatPlayer(
          game,
          action,
          oldTarget.owner!.id,
          oldTarget.getCoordinates()
        );
      }

      newTarget.building = null;
    }
  }

  // tileA destination
  public applyPlaceUnit(game: Game, action: GameAction) {
    const unit = new Unit(this.player, action.newUnitType!);
    unit.canMove = false;
    this.attack(game, action, unit);
    this.applyEffects(game, action);
    this.actions.push(action);
  }

  // tileA origin
  // tileB destination
  public applyMoveUnit(game: Game, action: GameAction) {
    this.attack(game, action, action.original[1].unit!);
    this.applyEffects(game, action);
    this.actions.push(action);
  }

  public applyPlaceBuilding(game: Game, action: GameAction) {
    const building = new Building(this.player, action.newBuildingType!);
    action.updates[0].building = building;
    this.applyEffects(game, action);
    this.actions.push(action);
  }
}
