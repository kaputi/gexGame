import { Asset, ASSET_TYPE_AUDIO, AssetType } from './assets';

export class AudioAsset implements Asset {
  type: AssetType = ASSET_TYPE_AUDIO;
  loaded = false;
  audio: HTMLAudioElement | null = null;

  constructor(
    public name: string,
    public src: string
  ) {}

  load(): Promise<HTMLAudioElement> {
    if (this.loaded) return Promise.resolve(this.audio as HTMLAudioElement);
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.audio = audio;
        this.loaded = true;
        resolve(audio);
      };
      audio.onerror = reject;
      audio.src = this.src;
    });
  }
}
