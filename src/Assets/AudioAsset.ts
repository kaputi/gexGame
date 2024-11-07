import { ASSET_TYPE_AUDIO } from './constants';
import { Asset, AssetType } from './types';

export class AudioAsset implements Asset {
  type: AssetType = ASSET_TYPE_AUDIO;
  loaded = false;
  data: HTMLAudioElement | null = null;

  constructor(
    public name: string,
    public src: string
  ) {}

  async load(): Promise<HTMLAudioElement> {
    if (this.loaded) return Promise.resolve(this.data as HTMLAudioElement);
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.data = audio;
        this.loaded = true;
        resolve(audio);
      };
      audio.onerror = reject;
      audio.src = this.src;
    });
  }
}
