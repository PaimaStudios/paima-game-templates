import { Application, Assets, Sprite, Text, Graphics } from 'pixi.js';
import {
  loader,
  animalQuestion,
  animalTalk,
  wait,
  showTokens,
  createButton,
  createInput,
  showKingTokens,
} from './graphics.js';

/* Global Game State */
let screen = 'none';
let ready = false;
let elapsed = 0.0;
const app = new Application();
let wallet = null;
let isLoading = false;
const assetsReference = {};
let gameId = 1000;
let game = {};

const updateScreen = data => {
  data.assets.forEach(d => app.stage.addChild(d));
  screen = data.name;
  elapsed = 0.0;
};

const startMain = () => {
  const bg = Sprite.from('/img/castle.png');

  const title = Sprite.from('/img/name.png');
  title.y = -300;

  const wow = Sprite.from('/img/wow.png');
  wow.x = 500;
  wow.y = 500;

  const [button1, text1] = createButton(320, 400, 'CONNECT WALLET', async () => {
    if (isLoading) return;
    isLoading = true;
    const result = await document.Paima.start();
    console.log(result);
    isLoading = false;
    if (!result.wallet) return;
    wallet = result;
    game = result.game;
    gameId = game.id;
    button1.destroy();
    text1.destroy();

    showTokens(app, result.tokens.tokens);
    showKingTokens(app, Math.max(100, result.tokens.global));
    const [button, text] = createButton(320, 400, 'START ADVENTURE', async () => {
      if (!ready) return; // wait for assets to load.
      button.destroy();
      text.destroy();
      updateScreen(startTiger());
    });
    app.stage.addChild(button);
    app.stage.addChild(text);
  });

  assetsReference.main_title = title;
  assetsReference.main_wow = wow;
  return { name: 'main', assets: [bg, title, wow, button1, text1] };
};

const clickCallback = (input, cleanup, animal, next) => async () => {
  if (isLoading) return;

  const value = input.value;
  if (!value) return;

  const l = loader(app);
  isLoading = true;
  const x = await document.Paima.ai(value, animal, gameId);
  isLoading = false;
  if (!x) {
    l.forEach(o => o.destroy());
    return;
  }
  console.log(x);
  cleanup();

  await animalTalk(app, x.stats.response);
  await wait(2000);
  updateScreen(next());
};

const startTiger = () => {
  const bg = Sprite.from('/img/tiger.png');
  const input = createInput(320, 550);

  const [button, text] = createButton(
    320,
    400,
    'Tell the Tiger your Response',
    clickCallback(
      input,
      () => {
        button.destroy();
        text.destroy();
        input.destroy();
      },
      'tiger',
      startMonkey
    )
  );

  assetsReference.tiger_button = button;
  assetsReference.tiger_input = input;
  animalQuestion(app, 'Which is the best Animal of the Entire Kingdom?').then(() => {});
  return { name: 'tiger', assets: [bg, button, text, input] };
};

const startMonkey = () => {
  const bg = Sprite.from('/img/monkey.png');

  const input = createInput(320, 550);
  const [button, text] = createButton(
    320,
    400,
    'Answer to Monkey',
    clickCallback(
      input,
      () => {
        button.destroy();
        text.destroy();
        input.destroy();
      },
      'monkey',
      startBison
    )
  );

  assetsReference.tiger_button = button;
  assetsReference.tiger_input = input;
  animalQuestion(app, 'What is most holy of all?').then(() => {});
  return { name: 'monkey', assets: [bg, button, text, input] };
};

const startBison = () => {
  const bg = Sprite.from('/img/bison.png');

  const input = createInput(320, 550);
  const [button, text] = createButton(
    320,
    400,
    'Replay the Bison',
    clickCallback(
      input,
      () => {
        button.destroy();
        text.destroy();
        input.destroy();
      },
      'bison',
      startPanda
    )
  );

  assetsReference.tiger_button = button;
  assetsReference.tiger_input = input;
  animalQuestion(app, 'What should the Kingdom do in case of war?').then(() => {});
  return { name: 'bison', assets: [bg, button, text, input] };
};

const endScreen = () => {
  const bg = Sprite.from('/img/panda.png');
  var graphics = new Graphics().rect(0, 0, 1024, 1024).fill({ color: 0x000000, alpha: 0.6 });

  setTimeout(async () => {
    const gameResults = await document.Paima.game(gameId);
    console.log({ gameResults });
    // stats
    //   block_height: 18687
    //   id: 4
    //   prize: 1000
    //   stage: "panda"
    //   wallet: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
    const text_ = new Text({
      text: `You have fooled the king\nAnd have been given\n${gameResults.stats.prize} Tokens`,
      style: {
        fontFamily: 'oswald',
        fontSize: 100,
        dropShadow: true,
        dropShadowBlur: 2,
        fill: '#f1c40f',
        align: 'center',
      },
    });
    app.stage.addChild(text_);

    text_.anchor.set(0.5, 0.5);
    text_.x = 1024 / 2;
    text_.y = 1024 / 2;
  }, 100);

  return { name: 'panda', assets: [bg, graphics] };
};

const startPanda = () => {
  const bg = Sprite.from('/img/panda.png');

  const input = createInput(320, 550);
  const [button, text] = createButton(
    320,
    400,
    'Convince the King',
    clickCallback(
      input,
      () => {
        button.destroy();
        text.destroy();
        input.destroy();
      },
      'panda',
      endScreen
    )
  );

  assetsReference.tiger_button = button;
  assetsReference.tiger_input = input;
  animalQuestion(app, 'Why should I give you Tokens?').then(() => {});
  return { name: 'panda', assets: [bg, button, text, input] };
};

(async () => {
  // Create the application helper and add its render target to the page
  await app.init({ width: 1024, height: 1024 });
  document.body.appendChild(app.canvas);
  Assets.addBundle('fonts', [
    { alias: 'oswald', src: '/assets/Oswald-VariableFont_wght.ttf', data: { family: 'Oswald' } },
  ]);
  // Load assets for main screen first.

  await Promise.all([
    Assets.loadBundle('fonts'),
    Assets.load('/img/castle.png'),
    Assets.load('/img/name.png'),
    Assets.load('/img/wow.png'),
    Assets.load('/img/button/b1.png'),
    Assets.load('/img/token.png'),
  ]);

  updateScreen(startMain());

  app.ticker.add(ticker => {
    elapsed += ticker.deltaTime;

    if (screen === 'main') {
      assetsReference.main_title.y = Math.min(Math.max(-300, -300.0 + elapsed), 100);
    }
    if (['tiger', 'monkey', 'panda', 'bison'].includes(screen)) {
      assetsReference.tiger_button.alpha = assetsReference.tiger_input.value.length > 0 ? 1.0 : 0.5;
    }
  });

  await Assets.load('/img/tiger.png');
  await Assets.load('/img/bison.png');
  await Assets.load('/img/monkey.png');
  await Assets.load('/img/panda.png');
  await Assets.load('/img/button/b2.png');
  ready = true;
})();
