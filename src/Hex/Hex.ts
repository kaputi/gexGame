import { flatSides, POINTY_TOP, pointySides } from '../hexUtils';
import { cube, axial } from '../hexUtils';
import { sqrt3, sqrt3_2, sqrt3_3 } from '../utils/math';

export class Hex {
  // prettier-ignore
  private static pointyMtx = {
    f0: sqrt3,   f1: sqrt3_2, f2: 0, f3: 3 / 2,
    b0: sqrt3_3, b1: -1 / 3,  b2: 0, b3: 2 / 3,
    startAngle: 0.5,
  };
  // prettier-ignore
  private static flatMtx = {
    f0: 3 / 2, f1: 0, f2: sqrt3_2, f3: sqrt3,
    b0: 2 / 3, b1: 0, b2: -1 / 3,  b3: sqrt3_3,
    startAngle: 0,
  };

  private static _width = -1;
  private static _height = -1;
  private static _size: AxialCoord = [0, 0];
  public static orientation: HexOrientation = POINTY_TOP;
  public static origin: AxialCoord = [0, 0];

  static set width(val: number) {
    Hex._width = val;
    if (Hex.orientation === POINTY_TOP) Hex._size[0] = val / sqrt3;
    else Hex._size[0] = val / 2;
  }

  static get width(): number {
    return Hex._width;
  }

  static set height(val: number) {
    Hex._height = val;
    if (Hex.orientation === POINTY_TOP) Hex._size[1] = val / 2;
    else Hex._size[1] = val / sqrt3;
  }

  static get height(): number {
    return Hex._height;
  }

  public static setDimensions(width: number, height: number): void {
    Hex.width = width;
    Hex.height = height;
  }

  public static pointToHex(point: AxialCoord): CubeCoord {
    if (Hex._width <= 0 || Hex._height <= 0)
      throw new Error('Hex2.width and Hex2.height must be set');
    const M = Hex.orientation === POINTY_TOP ? Hex.pointyMtx : Hex.flatMtx;
    const { _size, origin } = Hex;
    const pt = [(point[0] - origin[0]) / _size[0], (point[1] - origin[1]) / _size[1]];

    const q = M.b0 * pt[0] + M.b1 * pt[1];
    const r = M.b2 * pt[0] + M.b3 * pt[1];

    return cube.round(cube.fromAxial([q, r]));
  }

  public static hexToPoint(hex: CubeCoord): AxialCoord {
    if (Hex._width <= 0 || Hex._height <= 0)
      throw new Error('Hex2.width and Hex2.height must be set');
    const M = Hex.orientation === POINTY_TOP ? Hex.pointyMtx : Hex.flatMtx;
    const { _size, origin } = Hex;

    const x = (M.f0 * hex[0] + M.f1 * hex[1]) * _size[0];
    const y = (M.f2 * hex[0] + M.f3 * hex[1]) * _size[1];
    return [x + origin[0], y + origin[1]];
  }

  public static hexCornerPos(corner: number): AxialCoord {
    if (Hex._width <= 0 || Hex._height <= 0)
      throw new Error('Hex2.width and Hex2.height must be set');
    const M = Hex.orientation === POINTY_TOP ? Hex.pointyMtx : Hex.flatMtx;
    const { _size } = Hex;
    const angle = (2.0 * Math.PI * (M.startAngle + corner)) / 6;
    return [_size[0] * Math.cos(angle), _size[1] * Math.sin(angle)];
  }

  //// INSTANCE ////////////////////////////////////////////////////////////////

  private _id: string;
  private _cube: CubeCoord = [0, 0, 0];
  private _axial: AxialCoord = [0, 0];
  private _points: AxialCoord[] = [];
  private _selfSize: AxialCoord;
  private _selfOrigin: AxialCoord = [0, 0];
  private _selfOrientation: HexOrientation;
  public terrain = 'grass';

  constructor(q: number, r: number, s: number) {
    if (Math.round(q + r + s) !== 0) throw new Error('q + r + s must be 0');
    this._cube = [q, r, s];
    this._axial = cube.toAxial(this._cube);

    this._selfSize = Hex._size;
    this._selfOrigin[0] = Hex.origin[0];
    this._selfOrigin[1] = Hex.origin[1];
    this._selfOrientation = Hex.orientation;
    this._id = cube.toString(this._cube);
  }

  get id(): string {
    return this._id;
  }

  get cube(): CubeCoord {
    return this._cube;
  }

  set Cube(newCube: CubeCoord) {
    cube.setValues(newCube[0], newCube[1], newCube[2], this._cube);
    this._axial = cube.toAxial(this._cube);
    this._id = cube.toString(this._cube);
  }

  get axial(): AxialCoord {
    return this._axial;
  }

  set axial(val: AxialCoord) {
    this._axial = val;
    this._cube = cube.fromAxial(val);
    this._id = cube.toString(this._cube);
  }

  get center(): AxialCoord {
    return Hex.hexToPoint(this._cube);
  }

  get topLeft(): AxialCoord {
    const [cx, cy] = this.center;
    const leftCorner = Hex.hexCornerPos(Hex.orientation === POINTY_TOP ? 2 : 3);
    const topCorner = Hex.hexCornerPos(Hex.orientation === POINTY_TOP ? 4 : 0);
    return [cx + leftCorner[0], cy + topCorner[1]];
  }

  get points(): AxialCoord[] {
    if (
      this._points.length === 0 ||
      !axial.equal(this._selfSize, Hex._size) ||
      !axial.equal(this._selfOrigin, Hex.origin) ||
      this._selfOrientation !== Hex.orientation
    )
      this.calcPoints();

    return this._points;
  }

  private calcPoints(): void {
    const center = Hex.hexToPoint(this._cube);
    for (let i = 0; i < 6; i++) {
      const [x, y] = Hex.hexCornerPos(i);
      this._points[i] = [x + center[0], y + center[1]];
    }
  }

  public neighbor(direction: HexDirection): CubeCoord {
    return cube.neighbor(this._cube, direction, Hex.orientation);
  }

  public allNeighbors(): CubeCoord[] {
    const neighbors: CubeCoord[] = [];
    const sideMap = Hex.orientation === POINTY_TOP ? pointySides : flatSides;
    sideMap.forEach((_side, dir) => {
      neighbors.push(this.neighbor(dir));
    });
    return neighbors;
  }
}
