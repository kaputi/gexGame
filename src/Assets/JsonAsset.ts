import { ASSET_TYPE_JSON } from './constants';

export class JsonAsset implements Asset {
  type = ASSET_TYPE_JSON;
  loaded = false;
  data: unknown = null;

  constructor(
    public name: string,
    public src: string
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
