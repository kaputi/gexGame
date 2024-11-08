import { ASSET_TYPE_TILE } from './constants';
import { ImageAsset } from './ImageAsset';

export class TileAsset extends ImageAsset {
  // private _altitudeUnit = 0;
  // private _tileAltitude = 0;
  // private _altitude = 0;

  private _tileSize: [number, number] | null = null;
  private _resourceSize: [number, number] | null = null;
  private _offset: [number, number] | null = null;

  constructor(name: string, src: string) {
    super(name, src);
    this.type = ASSET_TYPE_TILE;
  }

  // set altitudeUnit(value: number) {
  //   this._altitudeUnit = value;
  //   this._altitude = this._altitudeUnit * this._tileAltitude;
  // }

  // get altitudeUnit(): number {
  //   return this._altitudeUnit;
  // }

  // set tileAltitude(value: number) {
  //   this._tileAltitude = value;
  //   this._altitude = this._altitudeUnit * this._tileAltitude;
  // }

  // get tileAltitude(): number {
  //   return this._tileAltitude;
  // }

  // get altitude(): number {
  //   if (this._altitude === 0) throw new Error('Altitude not set');
  //   return this._altitude;
  // }

  get resourceSize(): [number, number] | null {
    return this._resourceSize;
  }

  set resourceSize(value: [number, number]) {
    this._resourceSize = value;
    if (this._tileSize) this._offset = [value[0] - this._tileSize[0], value[1] - this._tileSize[1]];
  }

  get tileSize(): [number, number] | null {
    return this._tileSize;
  }

  set tileSize(value: [number, number]) {
    this._tileSize = value;
    if (this._resourceSize)
      this._offset = [this._resourceSize[0] - value[0], this._resourceSize[1] - value[1]];
  }

  get offset(): [number, number] | null {
    if (!this._resourceSize) throw new Error('resourceSize not set');
    if (!this._tileSize) throw new Error('tileSize not set');
    return this._offset;
  }
}
