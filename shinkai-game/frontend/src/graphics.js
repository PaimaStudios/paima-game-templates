import { Sprite, Text, Graphics } from 'pixi.js';
import { Input } from '@pixi/ui';

export const wait = n => new Promise(resolve => setTimeout(resolve, n));

export const loader = app => {
  var graphics = new Graphics().rect(0, 0, 1024, 1024).fill({ color: 0x000000, alpha: 0.6 });
  app.stage.addChild(graphics);
  return [graphics];
};

export const animalQuestion = async (app, text) => {
  await wait(300);
  var graphics = new Graphics()
    .rect(200, 40, 1024 - 400, 120)
    .fill({ color: 0x000000, alpha: 0.6 });
  app.stage.addChild(graphics);

  const words = text.split(/\s+/);
  const wordWrapWidth = 500;
  let last = null;
  for (let i = 0; i < words.length; i += 1) {
    const text_ = new Text({
      text: words
        .map((w, index) => (index <= i ? w : ''))
        .filter(x => x)
        .join(' '),
      style: {
        align: 'center',
        wordWrap: true,
        breakWords: true,
        fill: '#fff',
        wordWrapWidth,
        fontFamily: 'oswald',
        fontSize: 40,
        dropShadow: true,
      },
    });
    text_.anchor.set(0.5, 0.5);
    text_.x = 1024 / 2;
    text_.y = 100;
    if (last) last.destroy();
    app.stage.addChild(text_);
    last = text_;
    await wait(200);
  }
};

export const animalTalk = async (app, text) => {
  const words = text.split(/\s+/);
  const wordWrapWidth = 500;
  for (let i = 0; i < words.length; i += 1) {
    const wx = words.map((w, index) => (index <= i ? w : '')).filter(x => x);
    const text_ = new Text({
      text: wx.join(' '),
      style: {
        wordWrap: true,
        breakWords: true,
        fill: '#fff',
        wordWrapWidth,
        fontFamily: 'oswald',
        fontSize: 30,
        dropShadow: true,
      },
    });
    text_.anchor.set(0, 0);
    text_.x = (1024 - wordWrapWidth) / 2;
    text_.y = 300;
    app.stage.addChild(text_);
    if (wx[wx.length - 1].match(/^\*.*\*$/)) {
      // *pauses*
      await wait(1000);
    }
    await wait(200);
  }
};

export const showKingTokens = (app, tokens) => {
  // const wow = Sprite.from('/img/token.png');
  // wow.x = 40;
  // wow.y = 784;
  // app.stage.addChild(wow);

  const text_ = new Text({
    text: `The Panda King is Giving away\n${tokens} Tokens!`,
    style: {
      fontSize: 40,
      fontFamily: 'oswald',
      dropShadow: true,
      dropShadowBlur: 2,
      fill: '#f1c40f',
      align: 'right',
    },
  });
  text_.anchor.set(1, 0);
  text_.x = 1000;
  text_.y = 40;
  app.stage.addChild(text_);
};

export const showTokens = (app, tokens) => {
  const wow = Sprite.from('/img/token.png');
  wow.x = 40;
  wow.y = 784;
  app.stage.addChild(wow);

  const text_ = new Text({
    text: `${tokens}\nTokens`,
    style: {
      fontFamily: 'oswald',
      fontSize: 60,
      dropShadow: true,
      dropShadowBlur: 2,
      fill: '#f1c40f',
    },
  });
  text_.anchor.set(0, 0);
  text_.x = 240;
  text_.y = 810;
  app.stage.addChild(text_);
};

export const createButton = (x, y, text, callback) => {
  // b1 399x97
  // b2 399x199
  const sprite4 = Sprite.from('/img/button/b1.png');
  sprite4.eventMode = 'static';
  sprite4.cursor = 'pointer';
  sprite4.on('pointerdown', callback);
  sprite4.x = x; // 320;
  sprite4.y = y; // 400;

  const text_ = new Text({
    text,
    style: {
      align: 'center',
      fontFamily: 'oswald',
      fontSize: 30,
    },
  });
  text_.anchor.set(0.5, 0.5);
  text_.x = x + 399 / 2;
  text_.y = y + 97 / 2;

  return [sprite4, text_];
};

export const createInput = (x, y) => {
  const options = {
    bg: Sprite.from('/img/button/b2.png'),
    textStyle: {
      wordWrap: true,
      wordWrapWidth: 400,
      fontFamily: 'oswald',
      fontSize: 24,
    },
    placeholder: 'Write your response...',
    padding: {
      top: 11,
      right: 11,
      bottom: 11,
      left: 11,
    },
  };
  const input = new Input(options);
  input.x = x; // 320;
  input.y = y; // 550;
  return input;
};
