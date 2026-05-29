import type { Application } from 'pixi.js';
import type { QFTScreen } from './screens';

export class GameState {
  public static currentScreen: QFTScreen | null = null;
  public static elapsed = 0.0;
  public static isLoading = false;
  public static gameId = -1;
  public static game: { id: number };
  public static wallet: string = '-1';
  public static ready = false;

  public static app: Application;

  public static tick() {
    try {
      GameState.currentScreen?.tick();
    } catch (e) {
      console.log('Missed tick', e);
    }
  }
}
