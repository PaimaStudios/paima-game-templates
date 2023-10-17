import {Player} from './player.human';

export enum BuildingType {
  BASE = 'b',
  FARM = 'F',
  TOWER = 't',
  TOWER2 = 'T',
}

export class Building {
  constructor(
    public player: Player,
    public type: BuildingType // public tile: Tile
  ) {}

  public static getNameAndDescription(type: BuildingType) {
    switch (type) {
      case BuildingType.BASE:
        return {name: 'Base', description: 'Your army base'};
      case BuildingType.FARM:
        return {
          name: 'Farm',
          description: `Generates ${Building.getGoldGeneration(
            type
          )} gold per round`,
        };
      case BuildingType.TOWER:
        return {name: 'Tower', description: 'Defends your land'};
      case BuildingType.TOWER2:
        return {
          name: 'Mighty Tower',
          description: 'Defends your land from almost all enemies',
        };

      default:
        throw new Error('Building type not found. Missing price');
    }
  }

  public static defensiveArea(buildingType: BuildingType) {
    switch (buildingType) {
      case BuildingType.BASE:
        return 0;
      case BuildingType.FARM:
        return 0;
      case BuildingType.TOWER:
        return 1;
      case BuildingType.TOWER2:
        return 1;

      default:
        throw new Error('Building type not found. Missing price');
    }
  }

  public static getPowerLevel(type: BuildingType) {
    switch (type) {
      case BuildingType.BASE:
        return 1;
      case BuildingType.FARM:
        return 0;
      case BuildingType.TOWER:
        return 2;
      case BuildingType.TOWER2:
        return 3;

      default:
        throw new Error('Building type not found. Missing price');
    }
  }

  public static getGoldGeneration(buildingType: BuildingType) {
    switch (buildingType) {
      case BuildingType.BASE:
        return 3; // 2 builing +1 land
      case BuildingType.FARM:
        return 5; // 4 farm + 1 land
      case BuildingType.TOWER:
        return 1; // 1 from land
      case BuildingType.TOWER2:
        return 1; // 1 from land

      default:
        throw new Error('Building type not found. Missing price');
    }
  }

  public static getPrice(buildingType: BuildingType) {
    switch (buildingType) {
      case BuildingType.BASE:
        return 10;
      case BuildingType.FARM:
        return 20;
      case BuildingType.TOWER:
        return 30;
      case BuildingType.TOWER2:
        return 40;

      default:
        throw new Error('Building type not found. Missing price');
    }
  }
}
