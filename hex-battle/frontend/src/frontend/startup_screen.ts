import {ImageCache} from './load_screen';
import {ScreenUI} from './screen';

export class StartupScreen extends ScreenUI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private drawTimer: any;

  // first stage is to load the logo
  // second stage is to fade out
  private stageCounter = [50, 20];

  private logoSize = [400, 286];
  private alpha = 0;
  private imageCache = new ImageCache(null as any);
  readonly paimaLogo = '/assets/paima.png';

  constructor(public finishCallback: () => void) {
    super();
  }

  async start(): Promise<void> {
    this.setIsLoading(true);
    this.imageCache.preloadImage(this.paimaLogo);
    this.drawTimer = setInterval(() => this.DrawUI(), 33);
    return;
  }

  async stop(): Promise<void> {
    clearInterval(this.drawTimer);
    return;
  }

  selfStop() {
    if (this.stageCounter[0] === 0 && this.stageCounter[1] === 0) {
      this.stop();
      this.finishCallback();
      return;
    }

    if (this.stageCounter[0] > 0) {
      if (ImageCache.images.has(this.paimaLogo)) {
        this.stageCounter[0] -= 1;
        if (this.alpha < 1) {
          this.alpha += 0.05;
          this.alpha = Math.min(1, this.alpha);
        }
      }
      return;
    }

    if (this.stageCounter[1] > 0) {
      this.stageCounter[1] -= 1;
      if (this.alpha > 0) {
        this.alpha -= 0.1;
        this.alpha = Math.max(0, this.alpha);
      }
      return;
    }
  }

  DrawUI() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.stageCounter[0] === 0) this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = '#19B17B';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.DrawLogo();
    // this.DrawLoading();
    this.selfStop();
  }

  DrawLogo() {
    if (ImageCache.images.has(this.paimaLogo)) {
      this.ctx.globalAlpha = this.alpha;
      this.ctx.drawImage(
        ImageCache.images.get(this.paimaLogo),
        this.canvas.width / 2 - this.logoSize[0] / 2,
        this.canvas.height / 2 - this.logoSize[1] / 2,
        this.logoSize[0],
        this.logoSize[1]
      );
      this.ctx.globalAlpha = 1;
    }
  }
}
