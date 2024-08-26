import { Graphics, Sprite, Text } from 'pixi.js';
import {
  animalQuestion,
  animalTalk,
  createButton,
  createInput,
  loader,
  showKingTokens,
  showTokens,
  wait,
} from './graphics';
import type { Input } from '@pixi/ui';
import { paima } from './paima';
import { GameState } from './game-state';

export abstract class QFTScreen {
  public abstract assets: (Sprite | Text | Input | Graphics)[];
  public abstract name: string;

  // Interaction elements
  public abstract submitTalk: Sprite | Text | null;
  public abstract inputText: Input | null;
  public abstract inputBribe: Input | null;

  // Global setup
  static submitTalkCoord = { x: 320, y: 550 };
  static inputTextCoord = { x: 320, y: 400 };
  static inputBribeCoord = { x: 320, y: 600 };

  public updateScreen = (next: () => QFTScreen) => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const data = next();
    data.assets.forEach(d => GameState.app.stage.addChild(d));
    GameState.elapsed = 0.0;
    GameState.currentScreen = data;
  };

  public abstract tick(): void;

  clickCallback(input: Input, cleanup: Function, animal: string, next: () => QFTScreen) {
    return async () => {
      if (GameState.isLoading) return;

      const value = input.value;
      if (!value) return;

      const l = loader(GameState.app);
      GameState.isLoading = true;
      const x = await paima.ai(value, animal, GameState.gameId);
      GameState.isLoading = false;
      if (!x) {
        l.forEach(o => o.destroy());
        return;
      }
      console.log(x);
      cleanup();

      await animalTalk(GameState.app, x.stats.response);
      await wait(2000);
      this.updateScreen(next);
    };
  }
}

export class MainScreen extends QFTScreen {
  public tick(): void {
    this.main_title.y = Math.min(Math.max(-300, -300.0 + GameState.elapsed), 100);
  }
  private main_title: Sprite;
  public assets: (Sprite | Text | Input | Graphics)[];
  public name: string;
  public submitTalk: Sprite | Text | null = null;
  public inputText: Input | null = null;
  public inputBribe: Input | null = null;
  constructor() {
    super();
    const bg = Sprite.from('/assets/img/castle.png');
    this.main_title = Sprite.from('/assets/img/name.png');
    this.main_title.y = -300;

    const wow = Sprite.from('/assets/img/wow.png');
    wow.x = 500;
    wow.y = 500;

    const [button1, text1] = createButton(320, 400, 'CONNECT WALLET', async () => {
      if (GameState.isLoading) return;
      GameState.isLoading = true;
      const result = await paima.start();
      console.log(result);
      GameState.isLoading = false;
      if (!result.wallet) return;
      GameState.wallet = result.wallet;
      GameState.game = result.game;
      GameState.gameId = GameState.game.id;
      button1.destroy();
      text1.destroy();

      showTokens(GameState.app, result.tokens.tokens);
      showKingTokens(GameState.app, Math.max(100, result.tokens.global));
      const [button, text] = createButton(320, 400, 'START ADVENTURE', async () => {
        if (!GameState.ready) return; // wait for assets to load.
        button.destroy();
        text.destroy();
        this.updateScreen(() => new TigerScreen());
      });
      GameState.app.stage.addChild(button);
      GameState.app.stage.addChild(text);
    });

    this.name = 'main';
    this.assets = [bg, this.main_title, wow, button1, text1];
  }
}

export class TigerScreen extends QFTScreen {
  public tick(): void {
    if (this.submitTalk && this.inputText) {
      this.submitTalk.alpha = this.inputText.value.length > 0 ? 1.0 : 0.5;
    }
  }

  public assets: (Sprite | Text | Input | Graphics)[];
  public name: string;
  public submitTalk: Sprite | null;
  public inputText: Input | null;
  public inputBribe: Input | null;
  constructor() {
    super();
    const bg = Sprite.from('/assets/img/tiger.png');
    const input = createInput(QFTScreen.submitTalkCoord.x, QFTScreen.submitTalkCoord.y);

    const [button, text] = createButton(
      320,
      400,
      'Tell the Tiger your Response',
      this.clickCallback(
        input,
        () => {
          button.destroy();
          text.destroy();
          input.destroy();
        },
        'tiger',
        () => new MonkeyScreen()
      )
    );

    // Show text after above, and animates.
    animalQuestion(GameState.app, 'Which is the best Animal of the Entire Kingdom?').then(() => {});

    this.name = 'tiger';
    this.assets = [bg, button, text, input];
    this.submitTalk = button;
    this.inputText = input;
    this.inputBribe = null;
  }
}

export class MonkeyScreen extends QFTScreen {
  public tick(): void {
    if (this.submitTalk && this.inputText) {
      this.submitTalk.alpha = this.inputText.value.length > 0 ? 1.0 : 0.5;
    }
  }
  public assets: (Sprite | Text | Input | Graphics)[];
  public name: string;
  public submitTalk: Sprite | null;
  public inputText: Input | null;
  public inputBribe: Input | null;
  constructor() {
    super();
    const bg = Sprite.from('/assets/img/monkey.png');
    const input = createInput(QFTScreen.submitTalkCoord.x, QFTScreen.submitTalkCoord.y);

    const [button, text] = createButton(
      320,
      400,
      'Answer the Monkey',
      this.clickCallback(
        input,
        () => {
          button.destroy();
          text.destroy();
          input.destroy();
        },
        'monkey',
        () => new BisonScreen()
      )
    );

    // Show text after above, and animates.
    animalQuestion(GameState.app, 'What is most holy of all?').then(() => {});

    this.name = 'monkey';
    this.assets = [bg, button, text, input];
    this.submitTalk = button;
    this.inputText = input;
    this.inputBribe = null;
  }
}

export class BisonScreen extends QFTScreen {
  public tick(): void {
    if (this.submitTalk && this.inputText) {
      this.submitTalk.alpha = this.inputText.value.length > 0 ? 1.0 : 0.5;
    }
  }
  public assets: (Sprite | Text | Input | Graphics)[];
  public name: string;
  public submitTalk: Sprite | null;
  public inputText: Input | null;
  public inputBribe: Input | null;
  constructor() {
    super();
    const bg = Sprite.from('/assets/img/bison.png');
    const input = createInput(QFTScreen.submitTalkCoord.x, QFTScreen.submitTalkCoord.y);

    const [button, text] = createButton(
      320,
      400,
      'Replay the Bison',
      this.clickCallback(
        input,
        () => {
          button.destroy();
          text.destroy();
          input.destroy();
        },
        'bison',
        () => new PandaScreen()
      )
    );

    // Show text after above, and animates.
    animalQuestion(GameState.app, 'What should the Kingdom do in case of war?').then(() => {});

    this.name = 'bison';
    this.assets = [bg, button, text, input];
    this.submitTalk = button;
    this.inputText = input;
    this.inputBribe = null;
  }
}

export class EndScreen extends QFTScreen {
  public tick(): void {}
  public assets: (Sprite | Text | Input | Graphics)[];
  public name: string;
  public submitTalk: Sprite | null = null;
  public inputText: Input | null = null;
  public inputBribe: Input | null = null;
  constructor() {
    super();
    const bg = Sprite.from('/assets/img/panda.png');
    const graphics = new Graphics().rect(0, 0, 1024, 1024).fill({ color: 0x000000, alpha: 0.6 });

    setTimeout(async () => {
      const gameResults = await paima.game(GameState.gameId);
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
          // dropShadowBlur: 2,
          fill: '#f1c40f',
          align: 'center',
        },
      });
      GameState.app.stage.addChild(text_);

      text_.anchor.set(0.5, 0.5);
      text_.x = 1024 / 2;
      text_.y = 1024 / 2;
    }, 100);

    this.name = 'ending';
    this.assets = [bg, graphics];
  }
}

export class PandaScreen extends QFTScreen {
  public tick(): void {
    if (this.submitTalk && this.inputText) {
      this.submitTalk.alpha = this.inputText.value.length > 0 ? 1.0 : 0.5;
    }
  }
  public assets: (Sprite | Text | Input | Graphics)[];
  public name: string;
  public submitTalk: Sprite | null;
  public inputText: Input | null;
  public inputBribe: Input | null;
  constructor() {
    super();
    const bg = Sprite.from('/assets/img/panda.png');
    const input = createInput(QFTScreen.submitTalkCoord.x, QFTScreen.submitTalkCoord.y);

    const [button, text] = createButton(
      320,
      400,
      'Convince the King',
      this.clickCallback(
        input,
        () => {
          button.destroy();
          text.destroy();
          input.destroy();
        },
        'panda',
        () => new EndScreen()
      )
    );

    // Show text after above, and animates.
    animalQuestion(GameState.app, 'Why should I give you Tokens?').then(() => {});

    this.name = 'panda';
    this.assets = [bg, button, text, input];
    this.submitTalk = button;
    this.inputText = input;
    this.inputBribe = null;
  }
}
