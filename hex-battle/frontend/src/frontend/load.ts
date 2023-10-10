// image cache
import {Player, UnitType, BuildingType, Game} from '../engine';

// TODO Loading Paima Middleware from pre-compiled js
import * as mw from '../paima/middleware';

export class ImageCache {
  constructor(private game: Game) {}

  static images = new Map<string, any>();

  preloadImage(src: string) {
    return new Promise((resolve, reject) => {
      if (ImageCache.images.has(src)) return resolve(null);

      const img = new Image();
      img.src = src;
      img.onload = function () {
        ImageCache.images.set(src, img);
        resolve(null);
      };
      img.onerror = function (ev) {
        reject(ev);
      };
    });
  }

  getImageSource(
    unit: UnitType | BuildingType,
    playerId: string | null = null
  ): string {
    const pid = Player.getPlayerIndex(
      playerId || this.game.getCurrentPlayer().id
    );

    switch (unit) {
      case UnitType.UNIT_1:
        return `assets/Slice ${(pid * 4 + 1) % 24}.png`;
      case UnitType.UNIT_2:
        return `assets/Slice ${(pid * 4 + 2) % 24}.png`;
      case UnitType.UNIT_3:
        return `assets/Slice ${(pid * 4 + 3) % 24}.png`;
      case UnitType.UNIT_4:
        return `assets/Slice ${(pid * 4 + 4) % 24}.png`;
      case BuildingType.FARM:
        return `assets/Slice ${(pid % 19) + 54}.png`;
      case BuildingType.BASE:
        return `assets/Slice ${(pid % 6) + 41}.png`;
      case BuildingType.TOWER:
        return `assets/Slice ${((pid * 2) % 7) + 47}.png`;
      case BuildingType.TOWER2:
        return `assets/Slice ${((pid * 2 + 1) % 7) + 47}.png`;
      default:
        throw new Error('missing asset');
    }
  }
}

function loadFont() {
  return new Promise((resolve, reject) => {
    new FontFace(
      'Electrolize',
      'url(https://fonts.gstatic.com/s/electrolize/v18/cIf5Ma1dtE0zSiGSiED7AUEGso5tQafB.ttf)'
    )
      .load()
      .then(font => {
        (document.fonts as any).add(font);
        resolve(null);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// Preloads assets and shows loading screen
export async function firstLoad(game: Game) {
  await loadFont();
  await mw.default.userWalletLogin('metamask', false);

  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  const imageSize = 40;
  const xCenter = canvas.width / 2;
  let xImage = xCenter - (game.players.length / 2) * imageSize * 1.2;
  let yImage = 100;

  ctx.beginPath();
  ctx.font = '40px Electrolize';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', xCenter, 100);
  ctx.closePath();

  const imagesTypes = [
    UnitType.UNIT_1,
    UnitType.UNIT_2,
    UnitType.UNIT_3,
    UnitType.UNIT_4,
    BuildingType.FARM,
    BuildingType.TOWER,
    BuildingType.TOWER2,
    BuildingType.BASE,
  ];

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const imageCache = new ImageCache(game);

  const draw = () => {
    for (const player of game.players) {
      ctx.beginPath();
      ctx.fillStyle = Player.getColor(player.id);

      ctx.textAlign = 'left';
      ctx.font = '10px Electrolize';
      ctx.fillText(`Player ${player.id}`, xImage, yImage + 35);
      ctx.fillRect(
        xImage,
        yImage + imageSize,
        imageSize,
        imageSize * imagesTypes.length * 1.25
      );
      ctx.closePath();
      for (const i of imagesTypes) {
        const src = imageCache.getImageSource(i, player.id);
        yImage += imageSize * 1.2;

        if (ImageCache.images.has(src)) {
          const factor = Math.min(
            imageSize / ImageCache.images.get(src).width,
            imageSize / ImageCache.images.get(src).height
          );
          ctx.scale(factor, factor);

          ctx.drawImage(
            ImageCache.images.get(src),
            (1 / factor) * xImage,
            (1 / factor) * yImage
          );

          ctx.scale(1 / factor, 1 / factor);
        }
      }
      yImage = 100;
      xImage += imageSize * 1.2;
    }
  };

  for (const player of game.players) {
    await Promise.all(
      imagesTypes.map(i =>
        imageCache.preloadImage(imageCache.getImageSource(i, player.id))
      )
    );
    await wait(300);
    xImage = xCenter - (game.players.length / 2) * imageSize * 1.2;
    yImage = 100;
    draw();
  }

  await wait(1000);
}
