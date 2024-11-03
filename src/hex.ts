import { Coords, cubeCoord, CubeCoord } from './utils/hexCoord';
import { POINTY_TOP } from './utils/hexCoord/constants';

export class Hex {
  private _points: number[][] = [];
  private _selfSize = 0;
  private _selfOrientation: 'pointy' | 'flat' = 'pointy';
  readonly id: string;

  private _selected = false;

  constructor(private coord: CubeCoord) {
    this.id = cubeCoord.toString(coord);
  }

  get points() {
    if (Coords.size !== this._selfSize || Coords.orientation !== this._selfOrientation)
      this.updatePoints();
    return this._points;
  }

  select() {
    this._selected = true;
  }

  deselect() {
    this._selected = false;
  }

  get selected() {
    return this._selected;
  }

  private updatePoints() {
    this._selfSize = Coords.size;
    this._selfOrientation = Coords.orientation;

    const [cx, cy] = cubeCoord.cubeToPixel([0, 0], this.coord);

    if (this._selfOrientation === POINTY_TOP) {
      this._points = [
        [cx, cy - Coords.size],
        [cx + Coords.halfWidth, cy - Coords.size / 2],
        [cx + Coords.halfWidth, cy + Coords.size / 2],
        [cx, cy + Coords.size],
        [cx - Coords.halfWidth, cy + Coords.size / 2],
        [cx - Coords.halfWidth, cy - Coords.size / 2],
      ];
      return;
    }

    this._points = [
      [cx - Coords.size / 2, cy - Coords.halfHeight],
      [cx + Coords.size / 2, cy - Coords.halfHeight],
      [cx + Coords.size, cy],
      [cx + Coords.size / 2, cy + Coords.halfHeight],
      [cx - Coords.size / 2, cy + Coords.halfHeight],
      [cx - Coords.size, cy],
    ];
  }
}
