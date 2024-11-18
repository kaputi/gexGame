import { AudioAsset } from './AudioAsset';
import { FontAsset } from './FontAsset';
import { ImageAsset } from './ImageAsset';
import { JsonAsset } from './JsonAsset';
import { Asset } from './types';

export class AssetManager {
  private _toLoad = new Map<string, Asset>();
  private _loaded = new Map<string, Asset>();

  get progress(): [number, number] {
    return [this._loaded.size, this._loaded.size + this._toLoad.size];
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

    this._toLoad.set(name, asset);

    return asset;
  }

  remove(name: string): void {
    if (this._toLoad.has(name)) this._toLoad.delete(name);
    if (this._loaded.has(name)) this._loaded.delete(name);
  }

  get(name: string): Asset | null {
    if (this._loaded.has(name)) return this._loaded.get(name)!;
    if (this._toLoad.has(name)) return this._toLoad.get(name)!;
    return null;
  }

  clearToLoad(): void {
    this._toLoad.clear();
  }

  clearLoaded(): void {
    this._loaded.clear();
  }

  clear(): void {
    this.clearToLoad();
    this.clearLoaded();
  }

  async loadAsset(name: string): Promise<Asset> {
    if (this._loaded.has(name)) return this._loaded.get(name)!;
    const asset = this._toLoad.get(name);
    if (!asset) throw new Error(`Asset ${name} not found`);
    await asset.load();
    this._loaded.set(name, asset);
    this._toLoad.delete(name);
    return asset;
  }

  async loadAll(callback?: (a: Asset) => unknown): Promise<void> {
    const promises = Array.from(this._toLoad.values()).map(async (asset) => {
      await this.loadAsset(asset.name);
      if (callback) callback(asset);
    });
    await Promise.all(promises);
  }

  extractAssets(assets: string[]): Asset[] {
    const toKeep: Asset[] = [];
    assets.forEach((name) => {
      if (this._loaded.has(name)) toKeep.push(this._loaded.get(name)!);
    });
    return toKeep;
  }
}
