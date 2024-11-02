import { Vec3 } from './utils/coord';

const sqrt3 = Math.sqrt(3);
const sqrt3_2 = sqrt3 / 2;
// const sqrt3_3 = sqrt3 / 3;

export class Hex {
  private static _size: number = -1;
  private static _width: number = 0;
  private static _height: number = 0;
  private static _orientation: 'pointy' | 'flat' = 'pointy';

  private _points: number[][] = [];
  private _selfSize: number = 0;
  private _selfOrientation: 'pointy' | 'flat' = 'pointy';
  readonly id: string;

  constructor(private cubeCoord: Vec3) {
    this.id = `${cubeCoord[0]},${cubeCoord[1]},${cubeCoord[2]}`;
    Hex.updateDimensions();
  }

  static updateDimensions() {
    Hex._width = Hex._orientation === 'pointy' ? Hex._size * sqrt3 : Hex._size * 2;
    Hex._height = Hex._orientation === 'pointy' ? Hex._size * 2 : Hex._size * sqrt3;
  }

  static set orientation(value: 'pointy' | 'flat') {
    if (value === Hex._orientation) return;
    Hex._orientation = value;
    Hex.updateDimensions();
  }

  static get orientation() {
    return Hex._orientation;
  }

  static set size(value: number) {
    if (value === Hex._size) return;
    Hex._size = value;
    Hex.updateDimensions();
  }

  static get size() {
    return Hex._size;
  }

  get points() {
    if (Hex._size === -1) throw new Error('Hex.size must be set before accessing points');
    if (Hex._size !== this._selfSize || Hex._orientation !== this._selfOrientation)
      this.updatePoints();
    return this._points;
  }

  private updatePoints() {
    this._selfSize = Hex._size;
    this._selfOrientation = Hex._orientation;

    // TODO:  optimize to avoid repeated calculations (should be static and set on dimensions, all instances use it)
    if (Hex._orientation === 'pointy') {
      const cx = Hex._size * (sqrt3 * this.cubeCoord[0] + sqrt3_2 * this.cubeCoord[1]);
      const cy = Hex._size * ((3 / 2) * this.cubeCoord[1]);

      const halfWidth = Hex._width / 2;
      this._points = [
        [cx, cy - Hex._size],
        [cx + halfWidth, cy - Hex._size / 2],
        [cx + halfWidth, cy + Hex._size / 2],
        [cx, cy + Hex._size],
        [cx - halfWidth, cy + Hex._size / 2],
        [cx - halfWidth, cy - Hex._size / 2],
      ];
      return;
    }

    const cx = Hex._size * (3 / 2) * this.cubeCoord[0];
    const cy = Hex._size * (sqrt3_2 * this.cubeCoord[0] + sqrt3 * this.cubeCoord[1]);

    const halfHeight = Hex._height / 2;
    this._points = [
      [cx - Hex._size / 2, cy - halfHeight],
      [cx + Hex._size / 2, cy - halfHeight],
      [cx + Hex._size, cy],
      [cx + Hex._size / 2, cy + halfHeight],
      [cx - Hex._size / 2, cy + halfHeight],
      [cx - Hex._size, cy],
    ];
  }
}
