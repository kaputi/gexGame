import { AudioAsset } from './AudioAsset';
import { FontAsset } from './FontAsset';
import { ImageAsset } from './ImageAsset';
import { JsonAsset } from './JsonAsset';
import { Asset } from './types';

export class Assets {
  private toLoad = new Map<string, Asset>();
  private loaded = new Map<string, Asset>();
  private count = 0;
  protected _progress = '';

  get progress(): [number, number] {
    return [this.loaded.size, this.count];
  }

  add(name: string, src: string): Asset {
    const extension = src.split('.').pop();

    let asset: Asset;
    switch (extension) {
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        asset = new ImageAsset(name, src);
        break;
      case 'otf':
      case 'ttf':
      case 'woff':
      case 'ttc':
        asset = new FontAsset(name, src);
        break;
      case 'mp3':
      case 'wav':
      case 'oog>':
      case 'webm':
        asset = new AudioAsset(name, src);
        break;
      case 'json':
        asset = new JsonAsset(name, src);
        break;
      default:
        throw new Error('Unsupported file extension: ' + extension);
    }

    this.toLoad.set(name, asset);
    this.count++;

    return asset;
  }

  remove(name: string): void {
    if (this.toLoad.has(name)) {
      this.toLoad.delete(name);
      this.count--;
    }
    if (this.loaded.has(name)) {
      this.loaded.delete(name);
      this.count--;
    }
  }

  get(name: string): { asset: Asset; status: 'loaded' | 'not loaded' } | null {
    if (this.toLoad.has(name)) return { asset: this.toLoad.get(name)!, status: 'not loaded' };
    if (this.loaded.has(name)) return { asset: this.loaded.get(name)!, status: 'loaded' };
    return null;
  }

  clearToLoad() {
    this.count -= this.toLoad.size;
    this.toLoad = new Map<string, Asset>();
  }

  clearLoaded() {
    this.count -= this.loaded.size;
    this.loaded = new Map<string, Asset>();
  }

  async loadAsset(name: string): Promise<Asset | null> {
    if (this.loaded.has(name)) return this.loaded.get(name)!;
    const asset = this.toLoad.get(name);
    if (!asset) return null;
    await asset.load();
    this.loaded.set(name, asset);
    this.toLoad.delete(name);
    return asset;
  }

  async loadAllAssets(callback?: (a: Asset) => unknown): Promise<void> {
    const promises = Array.from(this.toLoad.values()).map((asset) => asset.load());
    await Promise.all(promises);
    this.toLoad.forEach((asset, name) => {
      this.loaded.set(name, asset);
      this.toLoad.delete(name);
      if (callback) callback(asset);
    });
  }
}
