import {UnitType, BuildingType, AIPlayer} from '@hexbattle/engine';
import {GameScreen} from './frontend/game/game_screen';
import {LoadScreen, loadFont} from './frontend/load_screen';
import {LobbyScreen} from './frontend/lobby_screen';
import {PreGameScreen} from './frontend/pregame_screen';
import {RulesScreen} from './frontend/game/rules_screen';
import {StartupScreen} from './frontend/startup_screen';
import * as mw from './paima/middleware';
import {RandomGame} from './random-game';

const TUTORIAL = false;
const PRACTICE = false;
const SKIP_STARTUP = false;

(async () => {
  console.log('Welcome to HexBattle!');
  await loadFont();

  if (TUTORIAL) {
    const game = RulesScreen.Setup();
    new LoadScreen(game).start().then(_ => {
      new RulesScreen(game).start();
    });
    return;
  }

  if (PRACTICE) {
    const game = new RandomGame(
      'PRACTICE',
      'OFFLINE',
      0,
      5,
      'large',
      Array(1).fill(UnitType.UNIT_1),
      [BuildingType.BASE],
      4,
      100,
      0.24
    );

    new LoadScreen(game).start().then(_ => {
      new GameScreen(game, false).start();

      // Launch game if first turn is not human.
      if (game.turn === 0) {
        const player = game.getCurrentPlayer();
        if (player instanceof AIPlayer) {
          setTimeout(() => player.randomMove(game), 1000);
        }
      }
    });
    return;
  }

  if (PRACTICE || TUTORIAL) {
    return;
  }

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const url = new URL(window.location.href);
  const lobby = url.searchParams.get('lobby');
  const wallet = url.searchParams.get('wallet');

  if (lobby && wallet) {
    const pregame_screen = new PreGameScreen(lobby, wallet);
    pregame_screen.start();
    return;
  }

  if (lobby && !wallet) {
    (window as any).wallet_selection_show((options: {wallet: string}) => {
      if (options.wallet) {
        mw.default.userWalletLogin(options.wallet, false).then((x: any) => {
          if (x.success) {
            window.location.replace(
              `/?lobby=${lobby}&wallet=${options.wallet}`
            );
          }
        });
      }
    });
    const gameLobby = new LobbyScreen();
    gameLobby.start();
  } else {
    if (SKIP_STARTUP) {
      const gameLobby = new LobbyScreen();
      gameLobby.start();
    } else {
      const startupScreen = new StartupScreen(() => {
        const gameLobby = new LobbyScreen();
        gameLobby.start();
      });
      startupScreen.start();
    }
  }
})();
