import { ImageAsset } from './Assets';
import { TileSet } from './TileSet';

export type SpriteMap = Map<string, { start: number; length: number }>;

export class SpriteSet extends TileSet {
  public speed = 1000 / 12;
  public spriteMap: SpriteMap;
  private _spriteName: string | null = null;
  private _frame = 0;
  private _start = 0;
  private _finish = 0;

  private _lastUpdate = 0;

  constructor(
    id: string,
    asset: ImageAsset,
    tileWidth: number,
    tileHeight: number,
    public rows: number,
    public columns: number,
    spriteMap?: SpriteMap
  ) {
    super(id, asset, tileWidth, tileHeight);
    if (spriteMap) this.spriteMap = spriteMap;
    else this.spriteMap = new Map();
  }

  set spriteName(val: string | null) {
    if (val && this.spriteMap.has(val)) {
      this._spriteName = val;
      const { start, length } = this.spriteMap.get(val)!;
      this._start = start;
      this._finish = start + length;
    } else {
      this._spriteName = null;
      this._start = 0;
      this._finish = 0;
    }

    this._frame = 0;
  }

  get spriteName() {
    return this._spriteName;
  }

  update(elapsed: number) {
    if (!this._spriteName) return;
    if (this._lastUpdate === 0) this._lastUpdate = elapsed;
    if (this._lastUpdate >= this.speed) {
      this._frame += Math.floor(this._lastUpdate / this.speed);
      this._lastUpdate = this._lastUpdate % this.speed;
    }

    let curr = this._start + this._frame;
    if (curr >= this._finish) {
      curr = this._start;
      this._frame = 0;
    }
    this.frameX = curr % this.columns;
    this.frameY = Math.floor(curr / this.columns);

    this._lastUpdate += elapsed;
  }
}
