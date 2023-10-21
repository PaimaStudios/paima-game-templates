import {Building} from './building';
import {GameMap} from './map';
import {Name} from './name';
import {Unit} from './unit';

export class Player {
  public isHuman = true;
  public alive = true;
  public name: string;
  constructor(
    public id: string,
    public gold: number,
    public wallet: string
  ) {
    this.name = Name.generateName(this.wallet);
  }

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
