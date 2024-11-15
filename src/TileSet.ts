import { ImageAsset } from './Assets';

export class TileSet {
  private _frameX = 0;
  private _frameY = 0;
  private _srcX = 0;
  private _srcY = 0;

  public width = 64;
  public height = 64;
  public x = 0;
  public y = 0;
  public ratio: number;

  constructor(
    readonly id: string,
    public asset: ImageAsset,
    readonly tileWidth: number,
    readonly tileHeight: number
  ) {
    // TODO: check that image is loaded, maybe this process add to loading screen
    this.ratio = tileHeight / tileWidth;
  }

  set frameX(val: number) {
    this._frameX = val;
    this._srcX = val * this.tileWidth;
  }

  get frameX() {
    return this._frameX;
  }

  set frameY(val: number) {
    this._frameY = val;
    this._srcY = val * this.tileHeight;
  }

  get frameY() {
    return this._frameY;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.asset.data as HTMLImageElement,
      this._srcX,
      this._srcY,
      this.tileWidth,
      this.tileHeight,
      this.x,
      this.y,
      this.width,
      this.height * this.ratio
    );
  }
}
