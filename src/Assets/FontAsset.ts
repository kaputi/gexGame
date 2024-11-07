import { ASSET_TYPE_FONT } from './constants';
import { Asset } from './types';

export class FontAsset implements Asset {
  type = ASSET_TYPE_FONT;
  loaded = false;
  data: FontFace | null = null;

  constructor(
    public name: string,
    public src: string
  ) {}

  async load(): Promise<FontFace> {
    if (this.loaded) return Promise.resolve(this.data as FontFace);

    return new Promise<FontFace>((resolve, reject) => {
      const font = new FontFace(this.name, `url(${this.src})`);
      font
        .load()
        .then(() => {
          this.data = font;
          this.loaded = true;
          resolve(font);
        })
        .catch(reject);
    });
  }
}
