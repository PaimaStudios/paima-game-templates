import {UnitType, BuildingType, AIPlayer, Hex, Name} from '@hexbattle/engine';
import * as mw from '../paima/middleware';
import {RandomGame} from '../random-game';
import {BackgroundScreen} from './background_screen';
import {GameScreen} from './game_screen';
import {LoadScreen} from './load_screen';
import {VERSION} from '../version';
import {RulesScreen} from './rules_screen';

export class LobbyScreen extends BackgroundScreen {
  drawTimer: any = null;
  walletName: string | null = null;
  walletAddress: string | null = null;
  private events: {
    coord: {x: number; y: number; width: number; height: number};
    cmd: string;
  }[] = [];

  constructor() {
    super();
  }

  async start() {
    this.setEventListeners();
    this.startDraw();
  }

  async stop() {
    clearInterval(this.drawTimer);
    this.canvas.removeEventListener('mousemove', this.mouse_hover_event);
    this.canvas.removeEventListener('click', this.mouse_click_event);
  }

  getMousePos(event: any) {
    const x = window.getComputedStyle(
      document.getElementsByClassName('container-zoom')[0]
    );
    const zoom = parseFloat(x.getPropertyValue('zoom'));
    const rect = this.canvas.getBoundingClientRect();
    // console.log({
    //   screen: 'lobby',
    //   zoom,
    //   clientX: event.clientX,
    //   rectLeft: rect.left,
    //   clientY: event.clientY,
    //   rectTop: rect.top,
    // });
    return {
      x: event.clientX / (zoom || 1) - rect.left,
      y: event.clientY / (zoom || 1) - rect.top,
    };
  }

  startDraw() {
    this.drawTimer = setInterval(() => this.Draw(), 33);
  }

  DrawButton(
    text: string,
    code: string,
    x: number,
    y: number
  ): {x: number; y: number; width: number; height: number} {
    this.ctx.textAlign = 'center';
    this.ctx.font = '30px Electrolize';
    const textMetrics = this.ctx.measureText(text);
    // console.log(textMetrics);
    const offset = 8;
    this.ctx.beginPath();
    if (this.hoverButton && this.hoverButton.cmd === code) {
      this.ctx.fillStyle = '#4b6584'; // green
    } else {
      this.ctx.fillStyle = '#34495e'; // asphault
    }
    //'#27ae60'; // green

    const w =
      Math.abs(textMetrics.actualBoundingBoxLeft) +
      Math.abs(textMetrics.actualBoundingBoxRight) +
      2 * offset;
    const h = Math.max(
      46,
      Math.abs(textMetrics.actualBoundingBoxAscent) +
        Math.abs(textMetrics.actualBoundingBoxDescent) +
        2 * offset
    );
    const x_ =
      x -
      offset -
      (Math.abs(textMetrics.actualBoundingBoxLeft) +
        Math.abs(textMetrics.actualBoundingBoxRight)) /
        2;
    const y_ = y - textMetrics.actualBoundingBoxAscent - offset;
    this.ctx.roundRect(x_, y_, w, h, 6);
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    // this.ctx.stroke();
    this.ctx.fillStyle = '#ecf0f1';
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
    return {x: x_, y: y_, width: w, height: h};
  }

  isInButton(
    x: number,
    y: number,
    coord: {x: number; y: number; width: number; height: number}
  ) {
    if (
      x > coord.x &&
      x < coord.x + coord.width &&
      y > coord.y &&
      y < coord.y + coord.height
    ) {
      return true;
    }
    return false;
  }

  DrawVersion() {
    this.ctx.textAlign = 'right';
    this.ctx.font = '12px Electrolize';
    this.ctx.fillStyle = '#333';
    this.ctx.fillText(VERSION, this.canvas.width - 40, this.canvas.height - 20);
  }

  hoverButton: {coord: {x: number; y: number; width: number; height: number}; cmd: string} | null = null;

  DrawButtons() {
    const buttonMargin = 80;
    const a = this.DrawButton(
      'Join Lobby',
      'JOIN',
      this.canvas.width * 0.25,
      this.canvas.height * 0.5 - buttonMargin
    );
    const b = this.DrawButton(
      'Create Lobby',
      'CREATE',
      this.canvas.width * 0.25,
      this.canvas.height * 0.5
    );
    const d = this.DrawButton(
      'Rejoin Game',
      'REJOIN',
      this.canvas.width * 0.25,
      this.canvas.height * 0.5 + buttonMargin
    );
    const c = this.DrawButton(
      'Practice Offline',
      'PRACTICE',
      this.canvas.width * 0.75,
      this.canvas.height * 0.5
    );
    const e = this.DrawButton(
      'Leaderboard',
      'LEADERBOARD',
      this.canvas.width * 0.75,
      this.canvas.height * 0.5 + buttonMargin
    );
    const f = this.DrawButton(
      'Tutorial',
      'TUTORIAL',
      this.canvas.width * 0.75,
      this.canvas.height * 0.5 - buttonMargin
    );

    if (!this.events.length) {
      this.events.push({coord: a, cmd: 'JOIN'});
      this.events.push({coord: b, cmd: 'CREATE'});
      this.events.push({coord: c, cmd: 'PRACTICE'});
      this.events.push({coord: d, cmd: 'REJOIN'});
      this.events.push({coord: e, cmd: 'LEADERBOARD'});
      this.events.push({coord: f, cmd: 'TUTORIAL'});
    }
  }

  DrawLogo() {
    const backColor = '#d1d8e0';
    const frontColor = '#4b6584';
    const topMargin = 100;
    const fontSize = 90;
    this.ctx.beginPath();
    this.ctx.fillStyle = frontColor;
    this.ctx.textAlign = 'center';
    this.ctx.font = fontSize + 'px Hexagon';

    const titleSize = this.ctx.measureText('Hexlands');
    // Draw bounding box for title
    this.ctx.fillStyle = 'white';
    this.ctx.globalAlpha = 0.7;
    this.ctx.strokeStyle = backColor;
    this.ctx.rect(
      this.canvas.width / 2 - titleSize.width / 2 - 10,
      topMargin - fontSize,
      titleSize.width + 20,
      fontSize + 14
    );
    this.ctx.fill();
    this.ctx.globalAlpha = 1;

    // Draw title
    this.ctx.fillStyle = '#a5b1c2';
    this.ctx.fillText('Hexlands', this.canvas.width / 2 - 1, topMargin-1);

    const max = 6;
    this.ctx.fillStyle = backColor;
    for (let i = 0; i <= max; i++) {
      this.ctx.fillText('Hexlands', this.canvas.width / 2 + i, topMargin + i);
    }

    this.ctx.fillStyle = frontColor;
    this.ctx.fillText(
      'Hexlands',
      this.canvas.width / 2 + max - 1,
      topMargin + max - 1
    );

    this.ctx.closePath();
  }

  Draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.DrawBackground();
    this.DrawVersion();
    this.DrawButtons();
    this.DrawLogo();
    this.DrawName();
    this.DrawToast();
    this.DrawLoading();
  }

  private playerName = '';
  private playerShort = '';
  DrawName() {
    if (this.walletAddress && !this.playerName) {
      this.playerName = Name.generateName(this.walletAddress);
      this.playerShort = Name.shortWallet(this.walletAddress);
    }
    this.ctx.beginPath();
    this.ctx.textAlign = 'left';
    this.ctx.font = '20px Electrolize';
    this.ctx.fillStyle = '#fff';
    const welcome = this.playerName
      ? `Welcome ${this.playerName} (${this.playerShort})`
      : 'Not Connected';
    this.ctx.fillText(welcome, 21, this.canvas.height - 19);
    this.ctx.fillStyle = '#333';
    this.ctx.fillText(welcome, 20, this.canvas.height - 20);
    this.ctx.closePath();
  }

  getMyWallet(callback: () => void) {
    try {
      const response = mw.default.getUserWallet(null, () => {
        throw new Error('User wallet not found');
      });
      if (!response.success) {
        throw new Error('Could not connect wallet.');
      }
      this.walletAddress = response.result || response.data;
      return callback();
    } catch (e) {
      (window as any).wallet_selection_show((options: {wallet: string}) => {
        if (options.wallet) {
          mw.default
            .userWalletLogin(options.wallet, false)
            .then((x: any) => {
              if (x.success) {
                this.walletName = options.wallet;
                this.walletAddress = x.result.walletAddress;
                this.setToastMessage('Wallet Connected!');
                return callback();
              } else {
                this.setToastMessage('Could not connect wallet.');
              }
            })
            .catch(e => {
              console.log(e);
              this.setToastMessage('Could not connect wallet.');
            });
        }
      });

      return null;
    }
  }

  cmd_rejoin = () => {
    if (this.getIsLoading()) return;
    this.setIsLoading(true);
    mw.default
      .getMyGames()
      .then(games => {
        if (!games.success) throw new Error('failed to get games');
        // games.data = [{ lobby_id, lobby_state, current_round, num_of_players, lobby_creator }]
        (window as any).rejoin_lobby_show(games.data, (id: string) => {
          this.stop();
          // go to pregame_screen
          window.location.replace(`/?lobby=${id}&wallet=${this.walletName}`);
        });
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  cmd_join = () => {
    if (this.getIsLoading()) return;
    this.setIsLoading(true);
    mw.default
      .getOpenLobbies()
      .then(lobbies => {
        if (!lobbies.success) throw new Error('failed to get lobbies');
        const joinableLobbies = lobbies.data || [];
        if (!joinableLobbies.length) console.log('No lobbies');

        (window as any).join_lobby_show(
          joinableLobbies.filter(
            (j: {lobby_creator: any}) => j.lobby_creator !== this.walletAddress
          ),
          (id: string) => {
            if (this.getIsLoading()) return;
            this.setIsLoading(true);
            mw.default
              .joinLobby(id)
              .then(res => {
                if (res.success) {
                  this.stop();
                  // go to pregame_screen
                  window.location.replace(
                    `/?lobby=${id}&wallet=${this.walletName}`
                  );
                }
              })
              .finally(() => {
                this.setIsLoading(false);
              });
          }
        );
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  cmd_create = () => {
    if (this.getIsLoading()) return;
    (window as any).new_game_options_show(
      (options: {
        number_of_players: string;
        units: string;
        gold: string;
        map_size: 'small' | 'medium' | 'large';
      }) => {
        // We will only keep the map from this.
        const game = new RandomGame(
          'DUMMY-GAME',
          'DUMMY-WALLET',
          parseInt(options.number_of_players, 10),
          0,
          options.map_size,
          Array(parseInt(options.units, 10)).fill(UnitType.UNIT_1),
          [BuildingType.BASE],
          Math.min(parseInt(options.units, 10) + 2, 4),
          parseInt(options.gold, 10),
          0.24
        );

        // eslint-disable-next-line no-async-promise-executor
        const mapCoords = game.map.tiles.map(t => t.getCoordinates());
        const numOfPlayers = parseInt(options.number_of_players, 10);
        const units = Array(parseInt(options.units, 10))
          .fill(UnitType.UNIT_1)
          .join('');
        const buildings = [BuildingType.BASE].join('');
        const gold = parseInt(options.gold, 10);
        const initTiles = Math.min(parseInt(options.units, 10) + 2, 4);
        const map = mapCoords.map(({q, r, s}) => `${q}#${r}`);

        if (this.getIsLoading()) return;
        this.setIsLoading(true);
        mw.default
          .createLobby(numOfPlayers, units, buildings, gold, initTiles, map)
          .then(response => {
            if (response.success) {
              this.stop();
              const lobby = (response.data as any).lobby_id;
              // go to prescreen
              window.location.replace(
                `/?lobby=${lobby}&wallet=${this.walletName}`
              );
            }
          })
          .finally(() => {
            this.setIsLoading(false);
          });
      }
    );
  };

  cmd_practice = () => {
    if (this.getIsLoading()) return;
    (window as any).practice_options_show(
      (options: {
        number_of_players: string;
        units: string;
        gold: string;
        map_size: 'small' | 'medium' | 'large';
      }) => {
        const game = new RandomGame(
          'PRACTICE',
          'OFFLINE',
          1,
          parseInt(options.number_of_players, 10),
          options.map_size,
          Array(parseInt(options.units, 10)).fill(UnitType.UNIT_1),
          [BuildingType.BASE],
          Math.min(parseInt(options.units, 10) + 2, 4),
          parseInt(options.gold, 10),
          0.24
        );

        this.stop();

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
      }
    );
  };

  cmd_leaderboard = () => {
    if (this.getIsLoading()) return;
    this.setIsLoading(true);
    mw.default
      .getLeaderBoard(this.walletAddress || null, 'wins')
      .then((res: any) => {
        if (res.success) {
          const players = res.data;
          players.forEach((p: any) => (p.name = Name.generateName(p.wallet)));
          (window as any).leaderboard_show(players);
        }
      })
      .finally(() => {
        this.setIsLoading(false);
      });
  };

  cmd_tutorial = () => {
    if (this.getIsLoading()) return;
    const game = RulesScreen.Setup();
    this.stop();
    new LoadScreen(game).start().then(_ => {
      new RulesScreen(game).start();
    });
  };

  mouse_click_event = (evt: Event) => {
    const mousePos = this.getMousePos(evt);
    const trigger = this.events.find(e =>
      this.isInButton(mousePos.x, mousePos.y, e.coord)
    );
    if (trigger) {
      switch (trigger.cmd) {
        case 'REJOIN':
          this.getMyWallet(this.cmd_rejoin);
          break;

        case 'JOIN':
          this.getMyWallet(this.cmd_join);
          break;

        case 'CREATE':
          this.getMyWallet(this.cmd_create);
          break;

        case 'PRACTICE': {
          this.cmd_practice();
          break;
        }

        case 'LEADERBOARD': {
          this.getMyWallet(this.cmd_leaderboard);
          break;
        }

        case 'TUTORIAL': {
          this.cmd_tutorial();
        }
      }
    }
  };

  
  mouse_hover_event = (evt: Event) => {
    const mousePos = this.getMousePos(evt);
    const trigger = this.events.find(e =>
      this.isInButton(mousePos.x, mousePos.y, e.coord)
    );
    if (trigger) {
      this.canvas.style.cursor = 'pointer';
      this.hover = null;
      this.hoverButton = trigger;
    } else {
      this.hoverButton = null;
      this.canvas.style.cursor = 'default';
      this.hover = Hex.pixel_to_pointy_hex(mousePos, 20);
    }
  };

  setEventListeners() {
    this.canvas.addEventListener('mousemove', this.mouse_hover_event);
    this.canvas.addEventListener('click', this.mouse_click_event);
  }
}
