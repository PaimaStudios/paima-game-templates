import {ImageCache} from './load_screen';
import {ScreenUI} from './screen';
import * as mw from '../paima/middleware';
import {
  Tile,
  Game,
  Moves,
  Unit,
  Building,
  Hex,
  UnitType,
  BuildingType,
  Player,
  XYCoord,
} from '@hexbattle/engine';
import {DrawHex} from './hex.draw';
enum ITEM {
  UNIT_1 = 0,
  UNIT_2 = 1,
  UNIT_3 = 2,
  UNIT_4 = 3,
  FARM = 4,
  TOWER = 5,
  TOWER2 = 6,
  END_TURN = 7,
  UNDO = 8,
}

export class GameScreen extends ScreenUI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timer: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchtimer: any = null;

  blockedUI = false;

  lastHighlightUpdate = new Date().getTime();

  // app 60 logical frames per second.
  frame = 0;

  // 1 wave per second
  readonly cos = new Array(60).fill(0).map((_, i) => {
    const x = Math.cos((i / 60) * 2 * Math.PI);
    return x;
  });

  readonly sin = new Array(60).fill(0).map((_, i) => {
    const x = Math.sin((i / 60) * 2 * Math.PI);
    return x;
  });

  // store if current player has more moves.
  playerHasMoves = true;

  // global scale [unitless]
  readonly size = 20;

  // default image size
  readonly imageSize = (this.size * 1.6) | 0;

  // global grid offset
  offset_x = 0;
  offset_y = 0;

  // HUD offset
  readonly HUD_height = this.size * 4.6;

  // HUD tiles
  itemTiles: Tile[] = [];

  // store if tile was clicked
  clickFirst: Tile | null = null;
  // store if item was clicked
  itemClick: Tile | null = null;
  // highlight tiles where item can be placed
  itemNearbyTiles: Tile[] = [];
  // highlight tiles where unit can move
  getMovingDistance: Tile[] = [];
  // store tile that is highlighted
  lastHighlight: Tile | null = null;
  // store item that is highlighted
  lastItemHightLight: Tile | null = null;

  last_block_height: number | null = null;
  now_block_height = -1;

  endGameWithDraw = false;

  constructor(
    private game: Game,
    private onChainGame: boolean
  ) {
    super();
    this.init();
  }

  isGameOver() {
    return this.game.winner || this.endGameWithDraw;
  }

  async start() {
    // update UI 30 times per second.
    this.timer = setInterval(
      () => {
        this.frame = (this.frame + 1) % 60; // this should go 0-60; but might be less.
        if (this.frame % 2 === 0) {
          this.playerHasMoves = this.game.currentPlayerHasMoves();
          this.drawGame();
        }
      },
      (1000 / 60) | 0
    );

    if (this.onChainGame) {
      this.fetchtimer = setInterval(() => {
        if (this.isGameOver()) return;
        mw.default.getLatestProcessedBlockHeight().then(date => {
          if (date.success) {
            this.now_block_height = date.result;
          }
        });

        mw.default
          .isGameOver(this.game.lobbyId)
          .then(res => {
            if (res.success) {
              if (
                res.data.isGameOver &&
                res.data.current_round === this.game.turn &&
                !this.game.winner
              ) {
                // Lobby closed and no winner. This is a draw.
                this.endGameWithDraw = true;
              }
            }
          })
          .catch(err => {
            console.log('isGameOver', err);
          });

        mw.default
          .getMoveForRound(this.game.lobbyId, this.game.turn)
          .then(res => {
            if (res.success && res.data) {
              console.log('getMoves', res.data);
              if (this.getIsLoading()) {
                console.log('Loading: do not apply moves. Wait...');
                return;
              }
              if (res.data.round !== this.game.turn) {
                console.log('Round missmatch: do not apply');
                return;
              }

              if (this.game.moves[this.game.turn]) {
                // This happens if we have moves, but zombie kicked in first.
                // Lets undo player moves and then apply zombie.
                const currentTurnMoves = this.game.moves[this.game.turn];
                while (currentTurnMoves.actions.length) {
                  this.game.undo();
                }
              }

              const move = Moves.deserializePaima(this.game, res.data);
              this.game.initMoves(move.player);
              for (const action of move.actions) {
                // 'move' | 'new_unit' | 'new_building';
                if (action.type === 'move') {
                  // const gameCopy = Game.import(Game.export(this.game));
                  // const updates = this.game.moves[move.turn].applyMoveUnit(
                  //   gameCopy,
                  //   action
                  // );
                  // console.log('>>', updates);

                  this.game.moves[move.turn].applyMoveUnit(this.game, action);
                } else if (action.type === 'new_unit') {
                  this.game.moves[move.turn].applyPlaceUnit(this.game, action);
                } else if (action.type === 'new_building') {
                  this.game.moves[move.turn].applyPlaceBuilding(
                    this.game,
                    action
                  );
                }
              }
              this.game.endTurn();
              this.last_block_height = res.data.block_height;
            }
          })
          .catch(err => {
            console.log('getMoves', err);
          });
      }, 1000);
    }
  }

  async stop() {
    this.canvas.removeEventListener('click', this.clickEventListener);
    this.canvas.removeEventListener('mousemove', this.hoverEventListener);
    this.canvas.removeEventListener('mousedown', this.mouseDownListener);
    this.canvas.removeEventListener('mouseup', this.mouseUpListener);
    this.timer && clearInterval(this.timer);
    this.fetchtimer && clearInterval(this.fetchtimer);
  }

  /// INIT AND HELPERS

  // user clicked on hud item
  clickOnItem(itemTile: Tile) {
    console.log('CLICK ITEM', itemTile);
    this.resetClick();
    try {
      const player = this.game.getCurrentPlayer();
      if (itemTile.unit) {
        if (player.gold < Unit.getPrice(itemTile.unit.type)) {
          throw new Error('No money');
        }
        this.itemClick = itemTile;
        this.itemNearbyTiles = this.game.getNewUnitTiles(
          player,
          itemTile.unit.type
        );
      } else if (itemTile.building) {
        if (player.gold < Building.getPrice(itemTile.building.type)) {
          throw new Error('No money');
        }
        this.itemClick = itemTile;
        this.itemNearbyTiles = this.game.getBuildingTiles(player);
      } else if (itemTile === this.itemTiles[ITEM.END_TURN]) {
        if (this.onChainGame) {
          console.log('SUBMIT END TURN');
          if (!this.game.moves[this.game.turn]) {
            this.setToastMessage('You have not moved yet');
            return;
          }

          this.blockedUI = true;
          const turn = this.game.turn;
          const moves = this.game.moves[this.game.turn].serializePaima();
          this.setIsLoading(true);
          mw.default
            .submitMoves(this.game.lobbyId, turn, moves)
            .then(res => {
              this.setIsLoading(false);
              this.blockedUI = false;
              if (res.success) {
                console.log('Move SUBMITED', {res, moves, turn});
                this.game.endTurn();
                this.last_block_height = this.now_block_height;
              }
            })
            .catch(err => {
              this.setIsLoading(false);
              console.log(err);
              this.blockedUI = false;
            });
        } else {
          this.game.endTurn();
        }
      } else if (itemTile === this.itemTiles[ITEM.UNDO]) {
        console.log('UNDO');
        this.game.undo();
      } else {
        throw new Error('unknown item');
      }
    } catch (e) {
      console.log('ITEM ERROR', e);
      this.resetClick();
    }
  }

  // reset all clicks and click side effects
  resetClick() {
    this.clickFirst = null;
    this.itemClick = null;
    this.getMovingDistance = [];
    this.itemNearbyTiles = [];
    this.lastHighlight = null;
    this.lastItemHightLight = null;
  }

  /* Animation */
  // wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));
  // vector: {
  //   origin: {x: number; y: number};
  //   target: {x: number; y: number};
  //   current: {x: number; y: number};
  //   step: number;
  //   currentStep: number;
  // } | null = null;

  // user clicked on map tile
  clickOnTile(tile: Tile) {
    const player = this.game.getCurrentPlayer();
    try {
      console.log('CLICK TILE', tile);
      // has clicked on item before
      if (this.itemClick) {
        if (this.itemClick.unit) {
          this.game.placeUnit(player, tile, this.itemClick.unit.type);
        } else if (this.itemClick.building) {
          this.game.placeBuilding(player, tile, this.itemClick.building.type);
        } else {
          throw new Error('unknown item');
        }

        this.resetClick();
        return;
      }

      // has clicked on a valid-unit tile before
      if (this.clickFirst) {
        try {
          /** Animate move */
          // const clickFirst = this.game.map.tiles.find(t =>
          //   t.same(this.clickFirst)
          // );
          // {
          //   const gameCopy = Game.import(Game.export(this.game));
          //   const tileA = gameCopy.map.tiles.find(t => t.same(this.clickFirst));
          //   const tileB = gameCopy.map.tiles.find(t => t.same(tile));
          //   const playerC = gameCopy.players.find(p => p.id === player.id);
          //   const action = gameCopy.moveUnit(playerC!, tileA!, tileB!);
          //   const origin = Hex.qrsToXy(action.origin!, this.size);
          //   const target = Hex.qrsToXy(action.target!, this.size);
          //   this.vector = {
          //     origin,
          //     target,
          //     current: origin,
          //     step: 100,
          //     currentStep: 0,
          //   };
          // }
          // const unitStore = clickFirst!.unit;
          // clickFirst!.unit = null;
          // (async () => {
          //   while (this.vector) {
          //     await this.wait(10);
          //     if (this.vector?.currentStep >= this.vector?.step) {
          //       this.vector = null;
          //     } else {
          //       this.vector.currentStep += 10;
          //       this.vector.current = {
          //         x:
          //           this.vector.origin.x +
          //           (this.vector.target.x - this.vector.origin.x) *
          //             (this.vector.currentStep / this.vector.step),
          //         y:
          //           this.vector.origin.y +
          //           (this.vector.target.y - this.vector.origin.y) *
          //             (this.vector.currentStep / this.vector.step),
          //       };
          //       const imageCache = new ImageCache(this.game);
          //       const src = imageCache.getImageSource(unitStore!.type);

          //       this.drawImage(
          //         this.vector.current.x,
          //         this.vector.current.y,
          //         src,
          //         ''
          //       );
          //     }
          //   }
          //   clickFirst!.unit = unitStore;
          //   this.game.moveUnit(player, clickFirst!, tile);
          // })();
          this.game.moveUnit(player, this.clickFirst, tile);
        } catch (e) {
          console.log(e);
        }
        this.resetClick();
        return;
      }

      // is first click on map.
      if (tile.unit && tile.unit.canMove && tile.owner?.id === player.id) {
        this.clickFirst = tile;
        this.getMovingDistance = this.game.getUnitMovement(this.clickFirst);
        return;
      }
      // clicked on non-game-element
      this.resetClick();
    } catch (e) {
      console.log('TILE ERROR', e);
      this.resetClick();
    }
  }

  // INIT HUD wit items tiles.
  private initItems() {
    if (this.itemTiles.length > 0) throw new Error('items already init');

    // helpers to create tiles in position
    // This is not very consistent.
    const y_ = this.canvas.height - this.HUD_height - this.offset_y;
    const itemPos = Hex.pixel_to_pointy_hex({x: -110, y: y_}, this.size);
    console.log({itemPos});
    const qrs = Tile.addVectors([
      itemPos,
      // Hex.pixel_to_pointy_hex({x:600, y:500}, this.size),
      // {q: -6, r: 14, s: -8},
      // {q: 2, r: 10, s: -12}
      // {q: 0, r: this.game.map.maxR, s: -this.game.map.maxR},
      // Tile.dirToVec(Tile.directionVector(5, 2)),
    ]);

    const buildVector = (dir: number[]) => {
      return Tile.vecToDir(
        Tile.addVectors([
          qrs,
          ...dir.map(d => Tile.dirToVec(Tile.directionVector(d, 1))),
        ])
      );
    };

    const north_east = 1;
    const south_east = 0;
    // const north_west = 3;
    // const south_west = 4;
    const south = 5;
    // const north = 2;
    const down = (i: number) => {
      return new Array(i).fill(0).map(() => south);
    };
    const move = (i: number) => {
      return new Array(i)
        .fill(0)
        .map((_, i) => (i % 2 === 0 ? north_east : south_east));
    };
    for (let i = 0; i < 9; i += 1) {
      switch (i) {
        case ITEM.UNIT_1:
          {
            const t = new Tile(...buildVector(move(2)));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.unit = new Unit(null as any, UnitType.UNIT_1, 'DUMMY_1');
            this.itemTiles.push(t);
          }
          break;
        case ITEM.UNIT_2:
          {
            const t = new Tile(...buildVector([...move(3), ...down(1)]));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.unit = new Unit(null as any, UnitType.UNIT_2, 'DUMMY_2');
            this.itemTiles.push(t);
          }
          break;
        case ITEM.UNIT_3:
          {
            const t = new Tile(...buildVector(move(4)));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.unit = new Unit(null as any, UnitType.UNIT_3, 'DUMMY_3');
            this.itemTiles.push(t);
          }
          break;
        case ITEM.UNIT_4:
          {
            const t = new Tile(...buildVector([...move(5), ...down(1)]));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.unit = new Unit(null as any, UnitType.UNIT_4, 'DUMMY_4');
            this.itemTiles.push(t);
          }
          break;
        case ITEM.FARM:
          {
            const t = new Tile(...buildVector([...move(7), ...down(1)]));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.building = new Building(null as any, BuildingType.FARM);
            this.itemTiles.push(t);
          }
          break;
        case ITEM.TOWER:
          {
            const t = new Tile(...buildVector([...move(8)]));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.building = new Building(null as any, BuildingType.TOWER);
            this.itemTiles.push(t);
          }
          break;
        case ITEM.TOWER2:
          {
            const t = new Tile(...buildVector([...move(9), ...down(1)]));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            t.building = new Building(null as any, BuildingType.TOWER2);
            this.itemTiles.push(t);
          }
          break;
        case ITEM.END_TURN:
          {
            const t = new Tile(...buildVector([...move(11), ...down(1)]));
            this.itemTiles.push(t);
          }
          break;
        case ITEM.UNDO:
          {
            const t = new Tile(...buildVector([...move(12)]));
            this.itemTiles.push(t);
          }
          break;
        default:
          throw new Error('Missing definition');
      }
    }
  }

  hoverEventListener = (evt: MouseEvent) => {
    if (this.isGameOver()) {
      // game finished;
      return;
    }
    const now = new Date().getTime();
    // refresh max 60fps
    if (now - this.lastHighlightUpdate < 16) {
      // console.log('skip');
      return;
    }

    this.lastHighlightUpdate = now;
    const mousePos = this.getMousePos(evt);

    const {q, r, s} = Hex.pixel_to_pointy_hex(mousePos, this.size);

    const itemHighlight = this.itemTiles.find(t => t.same({q, r, s}));
    if (itemHighlight) {
      this.lastHighlight = null;
      this.lastItemHightLight = itemHighlight;
      return;
    }

    const tileHighlight = this.game.map.tiles.find(t => t.same({q, r, s}));
    if (tileHighlight) {
      this.lastHighlight = tileHighlight;
      this.lastItemHightLight = null;
      return;
    }

    this.lastHighlight = null;
    this.lastItemHightLight = null;
  };

  getMousePos(event: MouseEvent, withOffset = true) {
    const x = window.getComputedStyle(
      document.getElementsByClassName('container-zoom')[0]
    );
    const zoom = parseFloat(x.getPropertyValue('zoom'));
    const rect = this.canvas.getBoundingClientRect();
    // console.log({
    //   screen: 'game_screen.ts',
    //   zoom,
    //   clientX: event.clientX,
    //   rectLeft: rect.left,
    //   clientY: event.clientY,
    //   rectTop: rect.top,
    // });
    return {
      x:
        event.clientX / (zoom || 1) -
        rect.left -
        (withOffset ? this.offset_x : 0),
      y:
        event.clientY / (zoom || 1) -
        rect.top -
        (withOffset ? this.offset_y : 0),
    };
  }

  hold_click = 0;
  hold_time: any = null;

  mouseDownListener = (evt: MouseEvent) => {
    if (this.isGameOver()) {
      const addHold = () => {
        const mouse_xy = this.getMousePos(evt, false);

        const x = this.HUD_height / 2;
        const y = this.canvas.height / 2 - this.HUD_height / 2;
        const w = this.canvas.width - 2 * this.HUD_height;
        const h = this.HUD_height;

        if (
          mouse_xy.x > x &&
          mouse_xy.x < x + w &&
          mouse_xy.y > y &&
          mouse_xy.y < y + h
        ) {
          if (this.hold_click < 100) {
            this.hold_click += 1;
            this.hold_time = setTimeout(addHold, 20);
          } else {
            window.location.replace('/');
          }
        }
      };

      clearTimeout(this.hold_time);
      this.hold_time = setTimeout(addHold, 20);
    }
  };

  mouseUpListener = (evt: MouseEvent) => {
    if (this.isGameOver() && (this.hold_time || this.hold_time)) {
      this.hold_click = 0;
      clearTimeout(this.hold_time);
    }
  };

  clickEventListener = (evt: MouseEvent) => {
    if (this.isGameOver()) {
      return;
    }

    const mousePos = this.getMousePos(evt);
    // check if human player turn
    if (this.game.getCurrentPlayer().isHuman === false) return;
    const {q, r, s} = Hex.pixel_to_pointy_hex(mousePos, this.size);

    // console.log({q, r, s});

    const myTurn =
      !this.onChainGame ||
      this.game.getCurrentPlayer().wallet === this.game.localWallet;

    if (myTurn && !this.blockedUI) {
      const itemTile = this.itemTiles.find(t => t.same({q, r, s}));
      if (itemTile) {
        this.clickOnItem(itemTile);
        return;
      }

      const tile = this.game.map.tiles.find(t => t.same({q, r, s}));
      if (tile) {
        this.clickOnTile(tile);
        return;
      }
    }

    // clicked on non-game-element
    this.resetClick();
  };

  // Init game variables.
  private async init() {
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    this.game.map.tiles.forEach(tile => {
      const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    this.offset_x = this.canvas.width / 2 - (maxX + minX) / 2;
    this.offset_y = -minY + this.size * 2; // canvas.height / 2 - (minY + maxY) / 2;
    this.last_block_height = this.game.startBlockheight;

    // init items
    this.initItems();

    // add event listener for clicks
    this.canvas.addEventListener('click', this.clickEventListener);

    // add event listener for mouse moves on canvas
    this.canvas.addEventListener('mousemove', this.hoverEventListener);

    // add event lister mouse-down and mouse-up;
    this.canvas.addEventListener('mousedown', this.mouseDownListener);
    this.canvas.addEventListener('mouseup', this.mouseUpListener);
  }

  /// DRAWING METHOD

  // DRAW turn text.
  drawTurn() {
    this.ctx.font = '20px VT323';
    this.ctx.fillStyle = 'black';
    this.ctx.beginPath();
    this.ctx.fillText(`Turn ${this.game.turn}`, 1100, 20);
    this.ctx.closePath();

    if (this.now_block_height > 0 && this.last_block_height) {
      const totalSeconds = 120;
      const elappsed =
        ((this.now_block_height - this.last_block_height) * mw.ENV.BLOCK_TIME) |
        0;
      const remaining = Math.max(0, totalSeconds - elappsed);
      this.ctx.beginPath();
      this.ctx.fillText(`${remaining}[s]`, 1100, 40);
      this.ctx.closePath();
    }
  }

  // DRAW single image with default size
  drawImage(x: number, y: number, src: string, text: string) {
    if (!ImageCache.images.has(src)) {
      throw new Error('Preload images first: ' + src);
    } else {
      const factor = Math.min(
        this.imageSize / ImageCache.images.get(src).width,
        this.imageSize / ImageCache.images.get(src).height
      );
      this.ctx.scale(factor, factor);
      this.ctx.drawImage(
        ImageCache.images.get(src),
        (1 / factor) * (x + this.offset_x) -
          ImageCache.images.get(src).width / 2,
        (1 / factor) * (y + this.offset_y) -
          ImageCache.images.get(src).height / 2
      );

      if (text) {
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.8;
        this.ctx.arc(
          (1 / factor) * (x + this.offset_x) +
            ImageCache.images.get(src).width / 2,
          (1 / factor) * (y + this.offset_y) +
            ImageCache.images.get(src).width / 2 -
            10 / factor,
          (1 / factor) * 5,
          0,
          2 * Math.PI
        );

        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        this.ctx.closePath();
        this.ctx.font = (((10 * 1) / factor) | 0) + 'px Electrolize';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          text,
          (1 / factor) * (x + this.offset_x) +
            ImageCache.images.get(src).width / 2,
          (1 / factor) * (y + this.offset_y) +
            ImageCache.images.get(src).width / 2 -
            6 / factor
        );
      }

      this.ctx.scale(1 / factor, 1 / factor);
    }
  }

  endTiles: (XYCoord & {color: string})[] = [];
  endFrame = 0;
  readonly colors = [
    '#1abc9c', // turquoise
    '#3498db', // peter river
    '#9b59b6', // amethyst
    '#e67e22', // carrot
    '#e74c3c', // alizarin
    '#2ecc71', // emerald
    '#f1c40f', // sun flower
    '#34495e', // wet asphalt
    '#95a5a6', // concrete
    '#f39c12', // orange
  ];

  drawWinnerOrLoser(winner: Player | null) {
    this.ctx.beginPath();
    this.ctx.globalAlpha = 0.7;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
    this.ctx.closePath();

    if (this.endFrame < 600) {
      let insert = false;
      while (!insert) {
        const x_ = (Math.random() * this.canvas.width) | 0;
        const y_ = (Math.random() * this.canvas.height) | 0;
        const qrs = Hex.pixel_to_pointy_hex({x: x_, y: y_}, this.size);
        const xy = {
          ...Hex.qrsToXy(qrs, this.size),
          color: this.colors[(Math.random() * this.colors.length) | 0],
        };
        if (!this.endTiles.find(t => t.x === xy.x && t.y === xy.y)) {
          insert = true;
          this.endTiles.push(xy);
        }
      }
      this.endFrame += 1;
    }

    this.ctx.lineWidth = 0;
    this.ctx.fillStyle = 'black';
    this.ctx.globalAlpha = 0.7;
    this.endTiles.forEach(t => {
      // const xy = Hex.pointy_hex_to_pixel(t, this.size);
      this.ctx.beginPath();
      this.ctx.fillStyle = t.color;
      DrawHex.drawHexagon(this.ctx, t.x, t.y, this.size);
      // this.ctx.fill();

      // this.ctx.fillStyle = 'black';
      // DrawHex.draw3DHexagon(this.ctx, t.x, t.y, this.size, 10, 10);
      this.ctx.fill();
      this.ctx.closePath();
    });
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = 1;

    // Background Area
    const lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.fillStyle = '#3c6382';
    this.ctx.fillRect(
      this.HUD_height / 2 - lineWidth,
      this.canvas.height / 2 - this.HUD_height / 2 - lineWidth,
      this.canvas.width - 2 * this.HUD_height + lineWidth * 2,
      this.HUD_height + lineWidth * 2
    );
    this.ctx.closePath();

    this.ctx.beginPath();
    if (winner) {
      this.ctx.fillStyle = Player.getColor(winner.id);
    } else {
      this.ctx.fillStyle = '#222';
    }
    this.ctx.fillRect(
      this.HUD_height / 2,
      this.canvas.height / 2 - this.HUD_height / 2,
      this.canvas.width - 2 * this.HUD_height,
      this.HUD_height
    );
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.globalAlpha = 0.3;
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(
      this.HUD_height / 2,
      this.canvas.height / 2 - this.HUD_height / 2,
      (this.hold_click / 100) * (this.canvas.width - 2 * this.HUD_height),
      this.HUD_height
    );
    this.ctx.globalAlpha = 1;
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.font = '40px Electrolize';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';

    if (winner) {
      const w = winner.wallet || '';
      const shortWallet = `${w.substring(0, 6)}...${w.substring(w.length - 4)}`;
      this.ctx.fillText(
        `Player ${shortWallet} wins!`,
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    } else {
      this.ctx.fillText(
        'Game ended in draw.',
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.font = '20px Electrolize';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'Hold click to exit',
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );
    this.ctx.closePath();
  }

  drawHUDBackgroundAndText() {
    const player = this.game.getCurrentPlayer();
    const lineWidth = 7;
    const HUD_top = this.canvas.height - this.HUD_height;

    // Background Area
    this.ctx.beginPath();
    this.ctx.fillStyle = '#3c6382';
    this.ctx.fillRect(0, HUD_top, this.canvas.width, this.HUD_height);
    this.ctx.closePath();

    // Main HUD Area
    this.ctx.beginPath();
    this.ctx.fillStyle = Player.getColor(player.id);
    this.ctx.fillRect(
      lineWidth,
      HUD_top + lineWidth,
      this.canvas.width - 2 * lineWidth,
      this.HUD_height - 2 * lineWidth
    );
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.font = '22px Electrolize';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'left';
    const shortWallet = `${player.wallet.substring(
      0,
      6
    )}...${player.wallet.substring(player.wallet.length - 4)}`;

    if (this.onChainGame) {
      if (player.wallet === this.game.localWallet) {
        this.ctx.fillText('Your turn', 20, HUD_top + 25);
      } else {
        this.ctx.fillText("Opponent's turn", 20, HUD_top + 25);
      }
    }

    this.ctx.fillText(
      `Player ${shortWallet} ${player.isHuman ? '' : 'AI'}`,
      20,
      HUD_top + 25 * 2
    );

    this.ctx.font = '20px Electrolize';
    const gpr = player.goldPerRound(this.game.map);
    this.ctx.fillText(
      `Gold ${player.gold} (${gpr >= 0 ? '+' : ''}${gpr})`,
      20,
      HUD_top + 25 * 3
    );

    this.ctx.closePath();

    if (this.itemClick || this.lastItemHightLight) {
      let text: string[] = ['', ''];
      if (this.itemClick) {
        text = this.getItemText(this.itemClick);
      } else if (this.lastItemHightLight) {
        text = this.getItemText(this.lastItemHightLight);
      }
      this.ctx.beginPath();
      this.ctx.fillStyle = 'white';
      const fontSize = ((20 * 3) / text.length) | 0;
      this.ctx.font = fontSize + 'px Electrolize';
      const startOffset = 10;
      for (let i = 0; i < text.length; i += 1) {
        this.ctx.fillText(
          text[i] || '',
          850,
          HUD_top + fontSize * 1.5 + fontSize * i * 1.1,
          300
        );
      }
    }
  }

  getItemText(item: Tile): string[] {
    if (item.unit) {
      const u = Unit.getNameAndDescription(item.unit.type);
      return [
        `${u.name} $${Unit.getPrice(item.unit.type)}`,
        `Maintenance $${Unit.getMaintenancePrice(item.unit.type)} per turn`,
        u.description,
        `Power Level ${Unit.getPowerLevel(item.unit.type)}`,
      ];
    }
    if (item.building) {
      const b = Building.getNameAndDescription(item.building.type);
      return [
        `${b.name} $${Building.getPrice(item.building.type)}`,
        b.description,
        `Power Level ${Building.getPowerLevel(item.building.type)}`,
      ];
    }
    if (item === this.itemTiles[ITEM.END_TURN]) {
      return ['END TURN', ''];
    }
    if (item === this.itemTiles[ITEM.UNDO]) {
      return ['UNDO LAST MOVE', ''];
    }
    throw new Error('Missing name');
  }

  // DRAW item tiles
  drawItems() {
    const player = this.game.getCurrentPlayer();
    // OUTLINE
    for (const tile of this.itemTiles) {
      const draw =
        !this.onChainGame ||
        tile.building ||
        tile.unit ||
        (!tile.building &&
          !tile.unit &&
          this.game.localWallet === player.wallet);

      if (draw) {
        const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#3c6382';
        this.ctx.lineWidth = (this.size * 0.125) | 0;
        DrawHex.drawHexagon(
          this.ctx,
          x + this.offset_x,
          y + this.offset_y,
          this.size * 1.3
        );
        this.ctx.fillStyle = '#3c6382';
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
    this.ctx.strokeStyle = 'black';

    // ITEM TILES
    for (const tile of this.itemTiles) {
      const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);
      this.ctx.beginPath();
      this.ctx.lineWidth = (this.size * 0.125) | 0;
      this.ctx.fillStyle = 'white';

      if (tile === this.itemTiles[ITEM.END_TURN]) {
        // do not draw
      } else if (tile === this.itemTiles[ITEM.UNDO]) {
        // do not draw
      } else {
        DrawHex.drawHexagon(
          this.ctx,
          x + this.offset_x,
          y + this.offset_y,
          this.size
        );
      }
      this.ctx.fill();
      this.ctx.closePath();
    }

    if (this.lastItemHightLight) {
      if (this.lastItemHightLight.same(this.itemTiles[ITEM.END_TURN])) {
        // do not draw
      } else if (this.lastItemHightLight.same(this.itemTiles[ITEM.UNDO])) {
        // do not draw
      } else {
        // console.log('draw item highlight', itemHighlight);
        this.ctx.beginPath();
        this.ctx.lineWidth = (this.size * 0.375) | 0;
        this.ctx.fillStyle = Player.getColor(player.id);
        const [x, y] = Hex.pointy_hex_to_pixel(
          this.lastItemHightLight,
          this.size
        );
        DrawHex.drawHexagon(
          this.ctx,
          x + this.offset_x,
          y + this.offset_y,
          this.size
        );
        this.ctx.fill();
        this.ctx.closePath();
      }
    }

    const imageCache = new ImageCache(this.game);
    for (const tile of this.itemTiles) {
      const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);
      if (tile.unit) {
        const src = imageCache.getImageSource(tile.unit.type);
        const hasGold = player.gold >= Unit.getPrice(tile.unit.type);
        if (!hasGold) this.ctx.filter = 'grayscale(1)';
        this.drawImage(x, y, src, '');
        if (!hasGold) this.ctx.filter = 'none';
      }
      if (tile.building) {
        const src = imageCache.getImageSource(tile.building.type);
        const hasGold = player.gold >= Building.getPrice(tile.building.type);
        if (!hasGold) this.ctx.filter = 'grayscale(1)';
        this.drawImage(x, y, src, '');
        if (!hasGold) this.ctx.filter = 'none';
      }
    }

    const myTurn = !this.onChainGame || player.wallet === this.game.localWallet;

    if (myTurn) {
      // UNDO
      const tile = this.itemTiles[ITEM.UNDO];
      const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);

      this.ctx.beginPath();

      if (this.lastItemHightLight?.same(this.itemTiles[ITEM.UNDO])) {
        this.ctx.lineWidth = (this.size * 0.375) | 0;
      } else {
        this.ctx.lineWidth = (this.size * 0.125) | 0;
      }
      if (this.game.moves[this.game.turn]?.actions.length > 0) {
        this.ctx.fillStyle = '#fad390';
      } else {
        this.ctx.fillStyle = '#ccc';
      }
      DrawHex.drawHexagon(
        this.ctx,
        x + this.offset_x,
        y + this.offset_y,
        this.size
      );
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.beginPath();
      const fontSize = this.size / 2;
      this.ctx.font = `${fontSize}px Electrolize`;
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        'UNDO',
        x + this.offset_x,
        y + this.offset_y + fontSize / 2
      );
      this.ctx.closePath();
    }
    // END TURN
    if (myTurn) {
      const c = this.playerHasMoves ? 0 : this.cos[this.frame];
      const tile = this.itemTiles[ITEM.END_TURN];
      const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);
      this.ctx.beginPath();

      if (this.lastItemHightLight?.same(this.itemTiles[ITEM.END_TURN])) {
        this.ctx.lineWidth = (this.size * 0.375) | 0;
      } else {
        this.ctx.lineWidth = (this.size * 0.125) | 0;
      }

      this.ctx.fillStyle = '#78e08f';
      //   this.ctx.lineWidth = (size * 0.125) | 0;
      DrawHex.drawHexagon(
        this.ctx,
        x + this.offset_x,
        y + this.offset_y,
        this.size + c * 2
      );
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.beginPath();
      const fontSize = c + this.size / 2;
      this.ctx.font = `${fontSize}px Electrolize`;
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        'END',
        x + this.offset_x,
        y + this.offset_y - fontSize * 0.2
      );
      this.ctx.fillText(
        'TURN',
        x + this.offset_x,
        y + this.offset_y + fontSize * 1.0
      );
      this.ctx.closePath();
    }
  }

  // DRAW player info
  drawPlayers() {
    for (let position = 0; position < this.game.players.length; position++) {
      const player = this.game.players[position];
      if (!player) throw new Error('Player not found');

      this.ctx.beginPath();
      this.ctx.fillStyle = Player.getColor(player.id);

      this.ctx.font = '18px VT323';
      this.ctx.textAlign = 'left';
      const shortWallet = `${player.wallet.substring(
        0,
        6
      )}...${player.wallet.substring(player.wallet.length - 4)}`;
      const name = player.isHuman
        ? `Player ${shortWallet}`
        : `AI ${shortWallet}`;
      this.ctx.fillText(name, 10, 20 + position * 22);

      if (!player.alive) {
        this.ctx.fillText('💀', 180, 20 + position * 22);
      } else {
        const gpr = player.goldPerRound(this.game.map);
        const goldText = `${player.gold} (${gpr >= 0 ? '+' + gpr : gpr})`;
        this.ctx.fillText(` Gold ${goldText}`, 180, 20 + position * 22);
      }
    }
  }

  // calculate shade of color [-100, 100]
  shadeColor(color: string, percent: number) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = ((R * (100 + percent)) / 100) | 0;
    G = ((G * (100 + percent)) / 100) | 0;
    B = ((B * (100 + percent)) / 100) | 0;

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    R = Math.round(R);
    G = Math.round(G);
    B = Math.round(B);

    const RR =
      R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  }

  // DRAW specific tile
  drawTile(tile: Tile, highlight: boolean, shade = 0 /* -100, 100 */) {
    this.ctx.beginPath();
    const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);
    if (highlight) {
      this.ctx.lineWidth = (this.size * 0.375) | 0;
    } else {
      this.ctx.lineWidth = (this.size * 0.125) | 0;
    }
    DrawHex.drawHexagon(
      this.ctx,
      x + this.offset_x,
      y + this.offset_y,
      this.size
    );

    if (tile.owner) {
      if (shade !== 0) {
        this.ctx.fillStyle = this.shadeColor(
          Player.getColor(tile.owner.id),
          shade
        );
      } else {
        this.ctx.fillStyle = Player.getColor(tile.owner.id);
      }
    } else {
      if (shade) {
        this.ctx.fillStyle = '#bbbbbb';
      } else {
        this.ctx.fillStyle = '#eeeeee';
      }
    }
    this.ctx.fill();
    this.ctx.closePath();

    const imageCache = new ImageCache(this.game);

    this.ctx.beginPath();
    if (
      highlight &&
      this.itemClick &&
      this.itemNearbyTiles.find(t => t.same(tile))
    ) {
      if (this.itemClick.unit) {
        this.drawImage(
          x,
          y,
          imageCache.getImageSource(this.itemClick.unit.type),
          `${Unit.getPowerLevel(this.itemClick.unit.type)}`
        );
      }
      if (this.itemClick.building) {
        this.drawImage(
          x,
          y,
          imageCache.getImageSource(this.itemClick.building.type),
          `${Building.getPowerLevel(this.itemClick.building.type)}`
        );
      }
    }

    if (tile.building && tile.owner) {
      this.drawImage(
        x,
        y,
        imageCache.getImageSource(tile.building.type, tile.owner.id),
        `${Building.getPowerLevel(tile.building.type)}`
      );
    }
    if (tile.unit && tile.owner) {
      const wiggle =
        tile.unit.canMove && tile.owner.id === this.game.getCurrentPlayerId();
      const c = wiggle ? this.cos[this.frame] * 2 : 0;
      const s = wiggle ? this.sin[this.frame] * 2 : 0;
      this.drawImage(
        x - s,
        y + c,
        imageCache.getImageSource(tile.unit.type, tile.owner.id),
        `${Unit.getPowerLevel(tile.unit.type)}`
      );
    }

    this.ctx.closePath();
  }

  // DRAW effect undermap
  draw3DUnderMap() {
    const elevation = [8, 8];

    // Draw under tiles effect

    this.ctx.fillStyle = '#0a3d62';
    for (const tile of this.game.map.tiles) {
      this.ctx.beginPath();

      //   this.ctx.lineWidth = 0;
      const [x, y] = Hex.pointy_hex_to_pixel(tile, this.size);

      DrawHex.draw3DHexagon(
        this.ctx,
        x + this.offset_x,
        y + this.offset_y,
        this.size,
        elevation[0],
        elevation[1]
      );
      this.ctx.fill();
      this.ctx.closePath();
    }
  }

  // DRAW game map
  drawMap() {
    // Draw tiles
    for (const tile of this.game.map.tiles) {
      if (this.clickFirst && this.clickFirst === tile) {
        // do nothing
      } else if (this.lastHighlight && this.lastHighlight === tile) {
        // draw at end.
      } else {
        let inMovementDistance = false;
        if (this.clickFirst) {
          if (this.getMovingDistance.length) {
            if (this.getMovingDistance.find(t => t.same(tile))) {
              inMovementDistance = true;
            }
          }
        }
        if (this.itemClick) {
          if (this.itemNearbyTiles.length) {
            if (this.itemNearbyTiles.find(t => t.same(tile))) {
              inMovementDistance = true;
            }
          }
        }
        this.drawTile(tile, false, inMovementDistance ? 25 : 0);
      }
    }
    if (this.clickFirst) this.drawTile(this.clickFirst, true, 40);
    if (this.lastHighlight) this.drawTile(this.lastHighlight, true, 80);
  }

  // MAIN DRAW FUNCTION

  drawGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayers();
    this.drawTurn();
    this.drawHUDBackgroundAndText();
    this.draw3DUnderMap();
    this.drawMap();
    this.drawItems();
    if (this.isGameOver()) {
      this.drawWinnerOrLoser(this.game.winner);
    }
    this.DrawToast();
    this.DrawLoading();
  }
}
