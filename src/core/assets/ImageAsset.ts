import { ASSET_TYPE_IMAGE } from '@core/assets';

export class ImageAsset implements Asset {
  type = ASSET_TYPE_IMAGE;
  loaded = false;
  data: HTMLImageElement | null = null;

  constructor(
    readonly name: string,
    readonly src: string
  ) {}

  async load(): Promise<HTMLImageElement> {
    if (this.loaded) return Promise.resolve(this.data as HTMLImageElement);

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.data = image;
        this.loaded = true;
        resolve(image);
      };
      image.onerror = () => reject(new Error(`Failed to load image: ${this.src}`));
      image.src = this.src;
    });
  }
}
