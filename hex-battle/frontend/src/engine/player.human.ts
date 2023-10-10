import {Building} from './building';
import {GameMap} from './map';
import {Unit} from './unit';

export class Player {
  public isHuman = true;
  public alive = true;
  public goldPerRound(map: GameMap) {
    let delta = 0;
    map.tiles
      .filter(m => m.owner === this)
      .forEach(tile => {
        if (tile.unit) {
          delta += Unit.getMaintenancePrice(tile.unit.type);
        } else if (tile.building) {
          delta += Building.getGoldGeneration(tile.building.type);
        } else {
          delta += 1;
        }
      });
    return delta;
  }

  public getGold(map: GameMap) {
    this.gold += this.goldPerRound(map);
  }

  constructor(
    public id: string,
    public gold: number
  ) {}

  static getColor(playerId: string) {
    switch (playerId) {
      case 'A':
        return '#1abc9c'; // turquoise
      case 'B':
        return '#3498db'; // peter river
      case 'C':
        return '#9b59b6'; // amethyst
      case 'D':
        return '#e67e22'; // carrot
      case 'E':
        return '#e74c3c'; // alizarin
      case 'F':
        return '#2ecc71'; // emerald
      case 'G':
        return '#f1c40f'; // sun flower
      case 'H':
        return '#34495e'; // wet asphalt
      case 'I':
        return '#95a5a6'; // concrete
      case 'J':
        return '#f39c12'; // orange
    }
    throw new Error('missing color');
  }

  static getPlayerIndex(playerId: string) {
    let pid = -1;
    switch (playerId) {
      case 'A':
        pid = 0;
        break;
      case 'B':
        pid = 1;
        break;
      case 'C':
        pid = 2;
        break;
      case 'D':
        pid = 3;
        break;
      case 'E':
        pid = 4;
        break;
      case 'F':
        pid = 5;
        break;
      case 'G':
        pid = 6;
        break;
      case 'H':
        pid = 7;
        break;
      case 'I':
        pid = 8;
        break;
      case 'J':
        pid = 9;
        break;
      default:
        throw new Error('missing player id');
    }
    return pid;
  }
}
