import { ASSET_TYPE_AUDIO } from '@core/assets';

export class AudioAsset implements Asset {
  type: AssetType = ASSET_TYPE_AUDIO;
  loaded = false;
  data: HTMLAudioElement | null = null;

  constructor(
    readonly name: string,
    readonly src: string
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
      audio.onerror = () => reject(new Error(`Failed to load audio: ${this.src}`));
      audio.src = this.src;
    });
  }
}
