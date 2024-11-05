import { sqrt3, sqrt3_2, sqrt3_3 } from '../utils/math';
import { CubeCoord, AxialCoord, HexOrientation, HexDirection } from './types';

import { flatSides, POINTY_TOP, pointySides } from './constants';
import { hexUtils } from '.';

export class Hex {
  // prettier-ignore
  static readonly pointyMtx = {
    f0: sqrt3,   f1: sqrt3_2, f2: 0, f3: 3 / 2,
    b0: sqrt3_3, b1: -1 / 3,  b2: 0, b3: 2 / 3,
    startAngle: 0.5,
  };
  // prettier-ignore
  static readonly flatMtx = {
    f0: 3 / 2, f1: 0, f2: sqrt3_2, f3: sqrt3,
    b0: 2 / 3, b1: 0, b2: -1 / 3,  b3: sqrt3_3,
    startAngle: 0,
  };

  private static _size: [number, number] = [0, 0];
  public static orientation: HexOrientation = POINTY_TOP;
  public static origin: [number, number] = [0, 0];

  static get size() {
    if (Hex._size[0] <= 0 || Hex._size[1] <= 0) throw new Error('Hex.size must be set');
    return Hex._size;
  }

  static set size(val: [number, number]) {
    if (val[0] === Hex._size[0] && val[1] === Hex._size[1]) return;
    Hex._size = val;
  }

  public static pointToHex(point: [number, number]): CubeCoord {
    const M = Hex.orientation === POINTY_TOP ? Hex.pointyMtx : Hex.flatMtx;
    const size = Hex.size;
    const origin = Hex.origin;
    const pt = [(point[0] - origin[0]) / size[0], (point[1] - origin[1]) / size[1]];

    const q = M.b0 * pt[0] + M.b1 * pt[1];
    const r = M.b2 * pt[0] + M.b3 * pt[1];

    return hexUtils.round(hexUtils.create(), [q, r, -q - r]);
  }

  public static hexToPoint(hex: CubeCoord): [number, number] {
    const M = Hex.orientation === POINTY_TOP ? Hex.pointyMtx : Hex.flatMtx;
    const size = Hex.size;
    const origin = Hex.origin;

    const x = (M.f0 * hex[0] + M.f1 * hex[1]) * size[0];
    const y = (M.f2 * hex[0] + M.f3 * hex[1]) * size[1];
    return [x + origin[0], y + origin[1]];
  }

  public static hexCornerOffset(corner: number): [number, number] {
    const M = Hex.orientation === POINTY_TOP ? Hex.pointyMtx : Hex.flatMtx;
    const size = Hex.size;
    const angle = (2.0 * Math.PI * (M.startAngle + corner)) / 6;
    return [size[0] * Math.cos(angle), size[1] * Math.sin(angle)];
  }

  //// INSTANCE ////////////////////////////////////////////////////////////////
  readonly id: string;
  private _cube: CubeCoord = [0, 0, 0];
  private _axial: AxialCoord = [0, 0];
  private _points: [number, number][] = [];
  private _selfSize: [number, number];
  private _selfOrigin: [number, number];
  private _selfOrientation: HexOrientation;
  private _selected = false;

  constructor(q?: number, r?: number, s?: number) {
    if (q !== undefined && r === undefined) {
      this._cube = [q, 0, -q];
      this._axial = [q, 0];
    } else if (q !== undefined && r !== undefined && s === undefined) {
      this._cube = [q, r, -q - r];
      this._axial = [q, r];
    } else if (q !== undefined && r !== undefined && s !== undefined) {
      if (Math.round(q + r + s) !== 0) throw new Error('q + r + s must be 0');
      this._cube = [q, r, s];
      this._axial = [q, r];
    }

    this._selfSize = Hex.size;
    this._selfOrientation = Hex.orientation;
    this._selfOrigin = Hex.origin;
    this.id = hexUtils.toString(this._cube);
  }

  get cube(): CubeCoord {
    return this._cube;
  }

  set cube(val: CubeCoord) {
    if (Math.round(val[0] + val[1] + val[2]) !== 0) throw new Error('q + r + s must be 0');
    this._cube = val;
    this._axial = [val[0], val[1]];
  }

  get axial(): AxialCoord {
    return this._axial;
  }

  set axial(val: AxialCoord) {
    this._axial = val;
    this._cube = [val[0], val[1], -val[0] - val[1]];
  }

  get points(): [number, number][] {
    if (
      this._points.length === 0 ||
      this._selfSize !== Hex.size ||
      this._selfOrientation !== Hex.orientation ||
      this._selfOrigin !== Hex.origin
    )
      this._calculatePoints();
    return this._points;
  }

  private _calculatePoints() {
    const center = Hex.hexToPoint(this._cube);
    for (let i = 0; i < 6; i++) {
      const [x, y] = Hex.hexCornerOffset(i);
      this._points[i] = [x + center[0], y + center[1]];
    }
  }

  get selected() {
    return this._selected;
  }

  deselect() {
    this._selected = false;
  }

  select() {
    this._selected = true;
  }

  neighbor(direction: HexDirection): CubeCoord {
    return hexUtils.neighbor(hexUtils.create(), this._cube, direction, Hex.orientation);
  }

  neighbors(): CubeCoord[] {
    const neighbors: CubeCoord[] = [];
    const map = Hex.orientation === POINTY_TOP ? pointySides : flatSides;
    map.forEach((_val, direction) => {
      neighbors.push(this.neighbor(direction));
    });
    return neighbors;
  }
}
