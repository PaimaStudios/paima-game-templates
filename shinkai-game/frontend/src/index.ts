import { Application, Assets } from 'pixi.js';
import { MainScreen } from './screens';
import { GameState } from './game-state';

const fontAssets = [
  {
    alias: 'oswald',
    src: '/assets/fonts/Oswald-VariableFont_wght.ttf',
    data: { family: 'Oswald' },
  },
];

const preAssets = [
  '/assets/img/castle.png',
  '/assets/img/name.png',
  '/assets/img/wow.png',
  '/assets/img/button/b1.png',
  '/assets/img/token.png',
];
const postAssets = [
  '/assets/img/tiger.png',
  '/assets/img/bison.png',
  '/assets/img/monkey.png',
  '/assets/img/panda.png',
  '/assets/img/button/b2.png',
];

(async () => {
  GameState.app = new Application();
  // Create the application helper and add its render target to the page
  await GameState.app.init({ width: 1024, height: 1024 });
  document.body.appendChild(GameState.app.canvas);

  // Load assets for main screen first.
  Assets.addBundle('fonts', fontAssets);
  await Promise.all([Assets.loadBundle('fonts'), ...preAssets.map(a => Assets.load(a))]);

  const start = new MainScreen();
  start.assets.forEach(d => GameState.app.stage.addChild(d));
  GameState.elapsed = 0.0;
  GameState.currentScreen = start;

  GameState.app.ticker.add(ticker => {
    GameState.elapsed += ticker.deltaTime;
    GameState.tick();
  });

  // Load other assets
  await Promise.all([...postAssets.map(a => Assets.load(a))]);

  GameState.ready = true;
})();
