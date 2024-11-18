import { TileSheet } from './TileSheet';
import { ImageAsset } from './assets';

export type SpriteMap = Map<string, { start: number; length: number }>;

export class SpriteSheet extends TileSheet {
  public speed = 1000 / 12;
  public spriteMap: SpriteMap;

  private _active = '';
  private _frame = 0;
  private _start = 0;
  private _finish = 0;

  private _prevTime = 0;

  constructor(
    id: string,
    asset: ImageAsset,
    tileWidth: number,
    tileHeight: number,
    readonly columns: number,
    readonly rows: number,
    spriteMap?: SpriteMap
  ) {
    super(id, asset, tileWidth, tileHeight);
    if (spriteMap) this.spriteMap = spriteMap;
    else this.spriteMap = new Map();
  }

  set activeSprite(name: string) {
    if (!this.spriteMap.has(name)) return;
    this._active = name;
    const { start, length } = this.spriteMap.get(name)!;
    this._start = start;
    this._finish = start + length;
  }

  get activeSprite(): string {
    return this._active;
  }

  update(deltaTime: number) {
    if (this._active === '') return;
    if (this._prevTime === 0) this._prevTime = deltaTime;
    if (this._prevTime >= this.speed) {
      this._frame += Math.floor(this._prevTime / this.speed);
      this._prevTime = this._prevTime % this.speed;
    }

    let curr = this._start + this._frame;
    if (curr >= this._finish) {
      curr = this._start;
      this._frame = 0;
    }

    this.frameX = curr % this.columns;
    this.frameY = Math.floor(curr / this.columns);

    this._prevTime += deltaTime;
  }
}
