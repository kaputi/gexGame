import { ASSET_TYPE_JSON } from '@core/assets';

export class JsonAsset implements Asset {
  type = ASSET_TYPE_JSON;
  loaded = false;
  data: unknown = null;

  constructor(
    readonly name: string,
    readonly src: string
  ) {}

  async load(): Promise<unknown> {
    if (this.loaded) return Promise.resolve(this.data);
    return fetch(this.src)
      .then((res) => res.json())
      .then((data) => {
        this.data = data;
        this.loaded = true;
        return data;
      });
  }
}
