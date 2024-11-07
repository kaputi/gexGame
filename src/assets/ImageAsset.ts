import { Asset, ASSET_TYPE_IMAGE, AssetType } from './assets';

export class ImageAsset implements Asset {
  type: AssetType = ASSET_TYPE_IMAGE;
  loaded = false;
  image: HTMLImageElement | null = null;

  constructor(
    public name: string,
    public src: string,
    public width: number,
    public height: number
  ) {}

  load(): Promise<HTMLImageElement> {
    if (this.loaded) return Promise.resolve(this.image as HTMLImageElement);

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.image = image;
        this.loaded = true;
        resolve(image);
      };
      image.onerror = reject;
      image.src = this.src;
    });
  }
}
