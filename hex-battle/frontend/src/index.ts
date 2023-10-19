import {loadFont} from './frontend/load_screen';
import {LobbyScreen} from './frontend/lobby_screen';
import {PreGameScreen} from './frontend/pregame_screen';
import {StartupScreen} from './frontend/startup_screen';
import * as mw from './paima/middleware';

(async () => {
  console.log('Welcome to HexBattle!');
  await loadFont();

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
    const startupScreen = new StartupScreen(() => {
      const gameLobby = new LobbyScreen();
      gameLobby.start();
    });
    startupScreen.start();
  }
})();
