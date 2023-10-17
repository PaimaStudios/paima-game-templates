import {loadFont} from './frontend/load_screen';
import {LobbyScreen} from './frontend/lobby_screen';
import {PreGameScreen} from './frontend/pregame_screen';
import {StartupScreen} from './frontend/startup_screen';

(async () => {
  console.log('Welcome to HexBattle!');
  await loadFont();

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const url = new URL(window.location.href);
  if (url.searchParams.has('lobby') && url.searchParams.has('wallet')) {
    const pregame_screen = new PreGameScreen(
      url.searchParams.get('lobby')!,
      url.searchParams.get('wallet')!
    );
    pregame_screen.start();
  } else {
    const startupScreen = new StartupScreen(() => {
      const gameLobby = new LobbyScreen();
      gameLobby.start();
    });
    startupScreen.start();
  }
})();
