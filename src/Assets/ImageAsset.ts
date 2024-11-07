import { ASSET_TYPE_IMAGE } from './constants';
import { Asset } from './types';

export class ImageAsset implements Asset {
  type = ASSET_TYPE_IMAGE;
  loaded = false;
  data: HTMLImageElement | null = null;

  constructor(
    public name: string,
    public src: string
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
      image.onerror = reject;
      image.src = this.src;
    });
  }
}
