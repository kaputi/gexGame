import { ImageAsset } from './ImageAsset';

export class TileAsset extends ImageAsset {
  constructor(
    public name: string,
    public src: string,
    public width: number,
    public height: number,
    public tileWidth: number,
    public tileHeight: number
  ) {
    super(name, src, width, height);
  }

  getTile(x: number, y: number): HTMLCanvasElement {
    // TODO: check code
    const canvas = document.createElement('canvas');
    canvas.width = this.tileWidth;
    canvas.height = this.tileHeight;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2d context');
    context.drawImage(
      this.image as HTMLImageElement,
      x * this.tileWidth,
      y * this.tileHeight,
      this.tileWidth,
      this.tileHeight,
      0,
      0,
      this.tileWidth,
      this.tileHeight
    );
    return canvas;
  }
}
