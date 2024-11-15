import { ImageAsset } from './Assets';

// TODO: maybe do a "manager" like in assets to be consistent

export class TileSet {
  public ratio: number;
  constructor(
    public id: string,
    public asset: ImageAsset,
    public tileWidth: number,
    public tileHeight: number
  ) {
    this.ratio = tileHeight / tileWidth;
  }

  public getImage(): HTMLImageElement {
    if (!this.asset.loaded) throw new Error('TileSet not loaded');
    return this.asset.data as HTMLImageElement;
  }
}
