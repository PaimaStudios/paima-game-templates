import { Application, Assets, Sprite, Text, Graphics } from 'pixi.js';
import { paima } from './paima';

/* Global Game State */
let ready = false;
let elapsed = 0.0;
const app = new Application();

let rectsShown = 0;
const drawTextOverlay = (info: string) => {
  console.log('Add text');

  const rectHeight = 60;
  const baseY = app.screen.height / 10;
  const y = baseY + rectHeight * rectsShown;
  const graphics = new Graphics()
    .rect(app.screen.width / 2 - 250, y - 30, 500, rectHeight)
    .fill(0xe74c3c);
  const text = new Text({
    text: info,
    style: {
      fontSize: 40,
      fill: '#FFF',
    },
    anchor: 0.5,
    x: app.screen.width / 2,
    y,
  });
  app.stage.addChild(graphics);
  app.stage.addChild(text);
  rectsShown++;
  setTimeout(() => {
    rectsShown--;
    console.log('Remove text');
    text.destroy();
    graphics.destroy();
  }, 3000);
};

(async () => {
  await app.init({ width: 1024, height: 1024 });
  document.body.appendChild(app.canvas);
  Assets.addBundle('fonts', [
    { alias: 'oswald', src: '/assets/Oswald-VariableFont_wght.ttf', data: { family: 'Oswald' } },
  ]);

  await Promise.all([
    Assets.loadBundle('fonts'),
    Assets.load('/img/c1.png'),
    Assets.load('/img/c2.png'),
    Assets.load('/img/c3.png'),
    Assets.load('/img/c4.png'),
    Assets.load('/img/c5.png'),
    Assets.load('/img/c6.png'),
    Assets.load('/img/c7.png'),
    Assets.load('/img/c8.png'),
    Assets.load('/img/c9.png'),
    Assets.load('/img/b1.png'),
  ]);

  const cards: Sprite[] = [];
  const cardStats: boolean[] = [];

  const addCard = (x: number, y: number, upwards: boolean): Sprite => {
    console.log({ x, y, upwards });
    const index = x * 3 + y + 1;
    const card = upwards ? Sprite.from(`/img/c${index}.png`) : Sprite.from(`/img/b1.png`);
    cards[index - 1] = card;
    cardStats[index - 1] = upwards;
    card.anchor.set(0.5);
    card.x = ((x + 1) * app.screen.width) / 4;
    card.y = ((y + 1) * app.screen.height) / 4;
    card.scale = 0.2;
    card.eventMode = 'static';
    card.cursor = 'pointer';
    card.on('pointerdown', async () => {
      await paima.sendTX(index);
      console.log('Event processed by paima-engine');
    });
    app.stage.addChild(card);
    return card;
  };

  const initialState = await paima.getCards();
  console.log({ initialState });
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const index = x * 3 + y + 1;
      const card = initialState.find(i => i.card === index);
      console.log(card, index);
      addCard(x, y, card!.upwards);
    }
  }

  paima.start();
  paima.connectEvents(async (info: string) => {
    drawTextOverlay(info);
    const initialState = await paima.getCards();
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const index = x * 3 + y + 1;
        const card = initialState.find(i => i.card === index);
        if (card?.upwards !== cardStats[index - 1]) {
          const scale = cards[index - 1].scale;
          cards[index - 1].destroy();
          const newCard = addCard(x, y, card!.upwards);
          newCard.scale = scale;
        }
      }
    }
  });

  let positive = true;
  app.ticker.add(ticker => {
    elapsed += ticker.deltaTime;
    try {
      const target = ((elapsed / 100) | 0) % 9;
      if (cards[target].scale._x <= 0.2) {
        positive = true;
      }
      if (cards[target].scale._x >= 0.27) {
        positive = false;
      }
      if (positive) cards[target].scale = cards[target].scale._x + 0.001;
      else cards[target].scale = cards[target].scale._x - 0.001;
    } catch (e) {
      console.log('Tick', e);
    }
  });
  ready = true;
})();
