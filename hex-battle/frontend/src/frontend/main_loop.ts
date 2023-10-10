import {
  Tile,
  Unit,
  UnitType,
  Building,
  BuildingType,
  Player,
  Game,
} from '../engine';
import {ImageCache} from './load';
import {Hex} from './hex';

// TODO Loading Paima Middleware from pre-compiled js
import * as mw from '../paima/middleware';

/** GLOBAL UI GAME STATE */
/** TODO MOVE INTO CLASS */
let lastHighlightUpdate = new Date().getTime();

// app 60 logical frames per second.
let frame = 0;

// 1 wave per second
const cos = new Array(60).fill(0).map((_, i) => {
  const x = Math.cos((i / 60) * 2 * Math.PI);
  return x;
});

const sin = new Array(60).fill(0).map((_, i) => {
  const x = Math.sin((i / 60) * 2 * Math.PI);
  return x;
});

// store if current player has more moves.
let playerHasMoves = true;

// global scale [unitless]
const size = 20;

// default image size
const imageSize = (size * 1.6) | 0;

// global grid offset
const offset_x = 245;
const offset_y = 400;

// hexagon angule [radians]
const a = (2 * Math.PI) / 6;

// HUD offset
const HUD_top = 677;
const HUD_height = size * 4.4;

// HUD tiles
const itemTiles: Tile[] = [];
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

// store if tile was clicked
let clickFirst: Tile | null = null;
// store if item was clicked
let itemClick: Tile | null = null;
// highlight tiles where item can be placed
let itemNearbyTiles: Tile[] = [];
// highlight tiles where unit can move
let getMovingDistance: Tile[] = [];
// store tile that is highlighted
let lastHighlight: Tile | null = null;
// store item that is highlighted
let lastItemHightLight: Tile | null = null;

// user clicked on hud item
function clickOnItem(itemTile: Tile, game: Game) {
  console.log('CLICK ITEM', itemTile);
  resetClick();
  try {
    const player = game.getCurrentPlayer();
    if (itemTile.unit) {
      if (player.gold < Unit.getPrice(itemTile.unit.type)) {
        throw new Error('No money');
      }
      itemClick = itemTile;
      itemNearbyTiles = game.getNewUnitTiles(player, itemTile.unit.type);
    } else if (itemTile.building) {
      if (player.gold < Building.getPrice(itemTile.building.type)) {
        throw new Error('No money');
      }
      itemClick = itemTile;
      itemNearbyTiles = game.getBuildingTiles(player);
    } else if (itemTile === itemTiles[ITEM.END_TURN]) {
      console.log('END TURN');
      mw.default.submitMoves('123456789012', 0, ['test']).then(res => {
        game.endTurn();
      });
    } else if (itemTile === itemTiles[ITEM.UNDO]) {
      console.log('UNDO');
      game.undo();
    } else {
      throw new Error('unknown item');
    }
  } catch (e) {
    console.log('ITEM ERROR', e);
    resetClick();
  }
}

// reset all clicks and click side effects
function resetClick() {
  clickFirst = null;
  itemClick = null;
  getMovingDistance = [];
  itemNearbyTiles = [];
  lastHighlight = null;
  lastItemHightLight = null;
}

// user clicked on map tile
function clickOnTile(tile: Tile, game: Game) {
  const player = game.getCurrentPlayer();
  try {
    console.log('CLICK TILE', tile);
    // has clicked on item before
    if (itemClick) {
      if (itemClick.unit) {
        game.placeUnit(player, tile, itemClick.unit.type);
      } else if (itemClick.building) {
        game.placeBuilding(player, tile, itemClick.building.type);
      } else {
        throw new Error('unknown item');
      }

      resetClick();
      return;
    }

    // has clicked on a valid-unit tile before
    if (clickFirst) {
      try {
        game.moveUnit(player, clickFirst, tile);
      } catch (e) {
        console.log(e);
      }
      resetClick();
      return;
    }

    // is first click on map.
    if (tile.unit && tile.unit.canMove && tile.owner?.id === player.id) {
      clickFirst = tile;
      getMovingDistance = game.getUnitMovement(clickFirst);
      return;
    }
    // clicked on non-game-element
    resetClick();
  } catch (e) {
    console.log('TILE ERROR', e);
    resetClick();
  }
}

// Init game variables.
// TODO move into draw class
export const init = async (game: Game) => {
  // canvas and context from html
  const canvas: HTMLCanvasElement = document.getElementById(
    'myCanvas'
  ) as HTMLCanvasElement;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  if (!ctx) throw new Error('no context');

  // INIT HUD wit items tiles.
  function initItems() {
    if (itemTiles.length > 0) throw new Error('items already init');

    // helpers to create tiles in position
    const qrs = Tile.addVectors([
      {q: 0, r: game.map.maxR, s: -game.map.maxR},
      Tile.dirToVec(Tile.directionVector(5, 2)),
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
      return new Array(i).fill(0).map(_ => south);
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
            t.unit = new Unit(null as any, UnitType.UNIT_1);
            itemTiles.push(t);
          }
          break;
        case ITEM.UNIT_2:
          {
            const t = new Tile(...buildVector([...move(3), ...down(1)]));
            t.unit = new Unit(null as any, UnitType.UNIT_2);
            itemTiles.push(t);
          }
          break;
        case ITEM.UNIT_3:
          {
            const t = new Tile(...buildVector(move(4)));
            t.unit = new Unit(null as any, UnitType.UNIT_3);
            itemTiles.push(t);
          }
          break;
        case ITEM.UNIT_4:
          {
            const t = new Tile(...buildVector([...move(5), ...down(1)]));
            t.unit = new Unit(null as any, UnitType.UNIT_4);
            itemTiles.push(t);
          }
          break;
        case ITEM.FARM:
          {
            const t = new Tile(...buildVector([...move(2), ...down(2)]));
            t.building = new Building(null as any, BuildingType.FARM);
            itemTiles.push(t);
          }
          break;
        case ITEM.TOWER:
          {
            const t = new Tile(...buildVector([...move(3), ...down(3)]));
            t.building = new Building(null as any, BuildingType.TOWER);
            itemTiles.push(t);
          }
          break;
        case ITEM.TOWER2:
          {
            const t = new Tile(...buildVector([...move(4), ...down(2)]));
            t.building = new Building(null as any, BuildingType.TOWER2);
            itemTiles.push(t);
          }
          break;
        case ITEM.END_TURN:
          {
            const t = new Tile(...buildVector([...move(8)]));
            itemTiles.push(t);
          }
          break;
        case ITEM.UNDO:
          {
            const t = new Tile(...buildVector([...move(8), ...down(2)]));
            itemTiles.push(t);
          }
          break;
        default:
          throw new Error('Missing definition');
      }
    }
  }
  // init items
  initItems();

  // add event listener for clicks
  canvas.addEventListener('click', evt => {
    // check if human player turn
    if (game.getCurrentPlayer().isHuman === false) return;

    const {q, r, s} = Hex.pixel_to_pointy_hex(
      {
        x: evt.offsetX - offset_x,
        y: evt.offsetY - offset_y,
      },
      size
    );

    const itemTile = itemTiles.find(t => t.same({q, r, s}));
    if (itemTile) {
      clickOnItem(itemTile, game);
      return;
    }

    const tile = game.map.tiles.find(t => t.same({q, r, s}));
    if (tile) {
      clickOnTile(tile, game);
      return;
    }

    // clicked on non-game-element
    resetClick();
  });

  // add event listener for mouse moves on canvas
  canvas.addEventListener('mousemove', evt => {
    const now = new Date().getTime();
    // refresh max 60fps
    if (now - lastHighlightUpdate < 16) {
      console.log('skip');
      return;
    }
    lastHighlightUpdate = now;
    const {q, r, s} = Hex.pixel_to_pointy_hex(
      {
        x: evt.offsetX - offset_x,
        y: evt.offsetY - offset_y,
      },
      size
    );

    const itemHighlight = itemTiles.find(t => t.same({q, r, s}));
    if (itemHighlight) {
      lastHighlight = null;
      lastItemHightLight = itemHighlight;
      return;
    }

    const tileHighlight = game.map.tiles.find(t => t.same({q, r, s}));
    if (tileHighlight) {
      lastHighlight = tileHighlight;
      lastItemHightLight = null;
      return;
    }

    lastHighlight = null;
    lastItemHightLight = null;
  });
};

class Draw {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(private game: Game) {
    // canvas and context from html
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!this.ctx) throw new Error('no context');
  }

  // draw 2d hexagon
  drawHexagon(x: number, y: number, size: number) {
    for (let i = 0; i <= 6; i++) {
      this.ctx.lineTo(x + size * Math.cos(a * i), y + size * Math.sin(a * i));
    }
    this.ctx.stroke();
  }

  // draw 3dish hexagon
  draw3DHexagon(x: number, y: number, size: number, x_o: number, y_o: number) {
    let start = 0;
    let end = 0;
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      start = x + size * Math.cos(a * i);
      end = y + size * Math.sin(a * i);
      this.ctx.lineTo(start, end);
      this.ctx.lineTo(start + x_o, end + y_o);
      this.ctx.lineTo(start, end);
    }
    this.ctx.lineTo(start + x_o, end + y_o);
    for (let i = 0; i <= 6; i++) {
      const start = x + size * Math.cos(a * i) + x_o;
      const end = y + size * Math.sin(a * i) + y_o;
      this.ctx.lineTo(start, end);
    }
    this.ctx.stroke();
  }

  // DRAW turn text.
  drawTurn() {
    this.ctx.beginPath();
    this.ctx.font = '20px Electrolize';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Turn ${this.game.turn}`, 700, 20);
    this.ctx.closePath();
  }

  // DRAW single image with default size
  drawImage(x: number, y: number, src: string, text: string) {
    if (!ImageCache.images.has(src)) {
      throw new Error('Preload images first: ' + src);
    } else {
      const factor = Math.min(
        imageSize / ImageCache.images.get(src).width,
        imageSize / ImageCache.images.get(src).height
      );
      this.ctx.scale(factor, factor);
      this.ctx.drawImage(
        ImageCache.images.get(src),
        (1 / factor) * (x + offset_x) - ImageCache.images.get(src).width / 2,
        (1 / factor) * (y + offset_y) - ImageCache.images.get(src).height / 2
      );

      if (text) {
        this.ctx.beginPath();
        this.ctx.globalAlpha = 0.8;
        this.ctx.arc(
          (1 / factor) * (x + offset_x) + ImageCache.images.get(src).width / 2,
          (1 / factor) * (y + offset_y) +
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
          (1 / factor) * (x + offset_x) + ImageCache.images.get(src).width / 2,
          (1 / factor) * (y + offset_y) +
            ImageCache.images.get(src).width / 2 -
            6 / factor
        );
      }

      this.ctx.scale(1 / factor, 1 / factor);
    }
  }

  drawHUDBackgroundAndText() {
    const player = this.game.getCurrentPlayer();
    const lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.fillStyle = Player.getColor(player.id);
    this.ctx.fillRect(0, HUD_top, 900, HUD_height);
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.fillStyle = '#3c6382';
    this.ctx.fillRect(0, HUD_top + HUD_height, 900, lineWidth);
    this.ctx.fillRect(0, HUD_top - lineWidth, 900, lineWidth);
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.font = '40px Electrolize';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(
      `Player ${player.id} ${player.isHuman ? '' : 'AI'}`,
      20,
      HUD_top + HUD_height / 2
    );

    this.ctx.font = '20px Electrolize';
    const gpr = player.goldPerRound(this.game.map);
    this.ctx.fillText(
      `Gold ${player.gold} (${gpr >= 0 ? '+' : ''}${gpr})`,
      20,
      HUD_top + HUD_height * 0.85
    );

    this.ctx.closePath();

    if (itemClick || lastItemHightLight) {
      let text: string[] = ['', ''];
      if (itemClick) {
        text = this.getItemText(itemClick);
      } else if (lastItemHightLight) {
        text = this.getItemText(lastItemHightLight);
      }
      this.ctx.beginPath();
      this.ctx.fillStyle = 'white';
      const fontSize = 20;
      this.ctx.font = fontSize + 'px Electrolize';
      const startOffset = text.length === 2 ? 0.45 : 0.35;
      this.ctx.fillText(text[0], 550, HUD_top + HUD_height * startOffset, 300);
      this.ctx.fillText(
        text[1],
        550,
        HUD_top + HUD_height * startOffset + fontSize * 1.1,
        300
      );
      if (text[2]) {
        this.ctx.fillText(
          text[2],
          550,
          HUD_top + HUD_height * startOffset + fontSize * 2.2,
          300
        );
      }
      this.ctx.closePath();
    }
  }

  getItemText(item: Tile): string[] {
    if (item.unit) {
      const u = Unit.getNameAndDescription(item.unit.type);
      return [
        `${u.name} $${Unit.getPrice(item.unit.type)}`,
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
    if (item === itemTiles[ITEM.END_TURN]) {
      return ['END TURN', ''];
    }
    if (item === itemTiles[ITEM.UNDO]) {
      return ['UNDO LAST MOVE', ''];
    }
    throw new Error('Missing name');
  }

  // DRAW item tiles
  drawItems() {
    const player = this.game.getCurrentPlayer();
    // OUTLINE
    for (const tile of itemTiles) {
      const [x, y] = Hex.pointy_hex_to_pixel(tile, size);
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#3c6382';
      this.ctx.lineWidth = (size * 0.125) | 0;
      this.drawHexagon(x + offset_x, y + offset_y, size * 1.3);
      this.ctx.fillStyle = '#3c6382';
      this.ctx.fill();
      this.ctx.closePath();
    }
    this.ctx.strokeStyle = 'black';

    // ITEM TILES
    for (const tile of itemTiles) {
      const [x, y] = Hex.pointy_hex_to_pixel(tile, size);
      this.ctx.beginPath();
      this.ctx.lineWidth = (size * 0.125) | 0;
      this.ctx.fillStyle = 'white';

      if (tile === itemTiles[ITEM.END_TURN]) {
        // do not draw
      } else if (tile === itemTiles[ITEM.UNDO]) {
        // do not draw
      } else {
        this.drawHexagon(x + offset_x, y + offset_y, size);
      }
      this.ctx.fill();
      this.ctx.closePath();
    }

    if (lastItemHightLight) {
      if (lastItemHightLight.same(itemTiles[ITEM.END_TURN])) {
        // do not draw
      } else if (lastItemHightLight.same(itemTiles[ITEM.UNDO])) {
        // do not draw
      } else {
        // console.log('draw item highlight', itemHighlight);
        this.ctx.beginPath();
        this.ctx.lineWidth = (size * 0.375) | 0;
        this.ctx.fillStyle = Player.getColor(player.id);
        const [x, y] = Hex.pointy_hex_to_pixel(lastItemHightLight, size);
        this.drawHexagon(x + offset_x, y + offset_y, size);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }

    const imageCache = new ImageCache(this.game);
    for (const tile of itemTiles) {
      const [x, y] = Hex.pointy_hex_to_pixel(tile, size);
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

    {
      // UNDO
      const tile = itemTiles[ITEM.UNDO];
      const [x, y] = Hex.pointy_hex_to_pixel(tile, size);

      this.ctx.beginPath();

      if (lastItemHightLight?.same(itemTiles[ITEM.UNDO])) {
        this.ctx.lineWidth = (size * 0.375) | 0;
      } else {
        this.ctx.lineWidth = (size * 0.125) | 0;
      }
      if (this.game.moves[this.game.turn]?.actions.length > 0) {
        this.ctx.fillStyle = '#fad390';
      } else {
        this.ctx.fillStyle = '#ccc';
      }
      this.drawHexagon(x + offset_x, y + offset_y, size);
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.beginPath();
      const fontSize = size / 2;
      this.ctx.font = `${fontSize}px Electrolize`;
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('UNDO', x + offset_x, y + offset_y + fontSize / 2);
      this.ctx.closePath();
    }
    // END TURN
    {
      const c = playerHasMoves ? 0 : cos[frame];
      const tile = itemTiles[ITEM.END_TURN];
      const [x, y] = Hex.pointy_hex_to_pixel(tile, size);
      this.ctx.beginPath();

      if (lastItemHightLight?.same(itemTiles[ITEM.END_TURN])) {
        this.ctx.lineWidth = (size * 0.375) | 0;
      } else {
        this.ctx.lineWidth = (size * 0.125) | 0;
      }

      this.ctx.fillStyle = '#78e08f';
      //   this.ctx.lineWidth = (size * 0.125) | 0;
      this.drawHexagon(x + offset_x, y + offset_y, size + c * 2);
      this.ctx.fill();
      this.ctx.closePath();

      this.ctx.beginPath();
      const fontSize = c + size / 2;
      this.ctx.font = `${fontSize}px Electrolize`;
      this.ctx.fillStyle = 'black';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('END', x + offset_x, y + offset_y - fontSize * 0.2);
      this.ctx.fillText('TURN', x + offset_x, y + offset_y + fontSize * 1.0);
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

      this.ctx.font = '18px Electrolize';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(
        ` Player ${player.id} ${player.isHuman ? '' : '[AI]'}`,
        10,
        20 + position * 22
      );

      if (!player.alive) {
        this.ctx.fillText('💀', 130, 20 + position * 22);
      } else {
        const gpr = player.goldPerRound(this.game.map);
        const goldText = `${player.gold} (${gpr >= 0 ? '+' + gpr : gpr})`;
        this.ctx.fillText(` Gold ${goldText}`, 130, 20 + position * 22);
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
    const [x, y] = Hex.pointy_hex_to_pixel(tile, size);
    if (highlight) {
      this.ctx.lineWidth = (size * 0.375) | 0;
    } else {
      this.ctx.lineWidth = (size * 0.125) | 0;
    }
    this.drawHexagon(x + offset_x, y + offset_y, size);

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
    if (highlight && itemClick && itemNearbyTiles.find(t => t.same(tile))) {
      if (itemClick.unit) {
        this.drawImage(
          x,
          y,
          imageCache.getImageSource(itemClick.unit.type),
          `${Unit.getPowerLevel(itemClick.unit.type)}`
        );
      }
      if (itemClick.building) {
        this.drawImage(
          x,
          y,
          imageCache.getImageSource(itemClick.building.type),
          `${Building.getPowerLevel(itemClick.building.type)}`
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
      const c = wiggle ? cos[frame] * 2 : 0;
      const s = wiggle ? sin[frame] * 2 : 0;
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
      const [x, y] = Hex.pointy_hex_to_pixel(tile, size);

      this.draw3DHexagon(
        x + offset_x,
        y + offset_y,
        size,
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
      if (clickFirst && clickFirst === tile) {
        // do nothing
      } else if (lastHighlight && lastHighlight === tile) {
        // draw at end.
      } else {
        let inMovementDistance = false;
        if (clickFirst) {
          if (getMovingDistance.length) {
            if (getMovingDistance.find(t => t.same(tile))) {
              inMovementDistance = true;
            }
          }
        }
        if (itemClick) {
          if (itemNearbyTiles.length) {
            if (itemNearbyTiles.find(t => t.same(tile))) {
              inMovementDistance = true;
            }
          }
        }
        this.drawTile(tile, false, inMovementDistance ? 25 : 0);
      }
    }
    if (clickFirst) this.drawTile(clickFirst, true, 40);
    if (lastHighlight) this.drawTile(lastHighlight, true, 80);
  }

  // MAIN DRAW FUNCTION

  drawGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlayers();
    this.drawTurn();
    this.drawHUDBackgroundAndText();
    this.drawItems();
    this.draw3DUnderMap();
    this.drawMap();
  }
}

export const start = (game: Game) => {
  // canvas and context from html
  const draw = new Draw(game);
  // update UI 30 times per second.
  setInterval(
    () => {
      frame = (frame + 1) % 60; // this should go 0-60; but might be less.
      if (frame % 2 === 0) {
        playerHasMoves = game.currentPlayerHasMoves();
        draw.drawGame();
      }
    },
    (1000 / 60) | 0
  );
};
