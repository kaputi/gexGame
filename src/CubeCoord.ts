export type CubeCoord = Float32Array;
export type HexDirection = 0 | 1 | 2 | 3 | 4 | 5;
export type HexOrientation = 'pointy' | 'flat';

export const POINTY_TOP: HexOrientation = 'pointy';
export const FLAT_TOP: HexOrientation = 'flat';

export type HexDirection2 =
  | 'NORTH'
  | 'NORTH_EAST'
  | 'EAST'
  | 'SOUTH_EAST'
  | 'SOUTH'
  | 'SOUTH_WEST'
  | 'WEST'
  | 'NORTH_WEST';

export const NORTH: HexDirection2 = 'NORTH';
export const NORTH_EAST: HexDirection2 = 'NORTH_EAST';
export const EAST: HexDirection2 = 'EAST';
export const SOUTH_EAST: HexDirection2 = 'SOUTH_EAST';
export const SOUTH: HexDirection2 = 'SOUTH';
export const SOUTH_WEST: HexDirection2 = 'SOUTH_WEST';
export const WEST: HexDirection2 = 'WEST';
export const NORTH_WEST: HexDirection2 = 'NORTH_WEST';

class Cube {
  private static cubeEpsilon: CubeCoord = new Float32Array([1e-6, 2e-6, -3e-6]);

  private static pointySides2: Map<HexDirection2, CubeCoord> = new Map([
    [NORTH_EAST, new Float32Array([1, -1, 0])],
    [EAST, new Float32Array([1, 0, -1])],
    [SOUTH_EAST, new Float32Array([0, 1, -1])],
    [SOUTH_WEST, new Float32Array([-1, 1, 0])],
    [WEST, new Float32Array([-1, 0, 1])],
    [NORTH_WEST, new Float32Array([0, -1, 1])],
  ]);


  // private static pointySides: CubeCoord[] = [
  //   new Float32Array([1, -1, 0]), // north east
  //   new Float32Array([1, 0, -1]), // east
  //   new Float32Array([0, 1, -1]), // south east
  //   new Float32Array([-1, 1, 0]), // south west
  //   new Float32Array([-1, 0, 1]), // west
  //   new Float32Array([0, -1, 1]), // north west
  // ];

  private static pointyDiagonals: CubeCoord[] = [
    new Float32Array([1, -2, 1]), // north
    new Float32Array([2, -1, -1]), // north east
    new Float32Array([1, 1, -2]), // south east
    new Float32Array([-1, 2, -1]), // south
    new Float32Array([-2, 1, 1]), // south west
    new Float32Array([-1, -1, 2]), // north west
  ];

  private static flatSides: CubeCoord[] = [
    new Float32Array([0, -1, 1]), // north
    new Float32Array([1, -1, 0]), // north east
    new Float32Array([1, 0, -1]), // south east
    new Float32Array([0, 1, -1]), // south
    new Float32Array([-1, 1, 0]), // south west
    new Float32Array([-1, 0, 1]), // north west
  ];

  private static flatDiagonals: CubeCoord[] = [
    new Float32Array([1, -2, 1]), // north east
    new Float32Array([2, -1, -1]), // east
    new Float32Array([1, 1, -2]), // south east
    new Float32Array([-1, 2, -1]), // south west
    new Float32Array([-2, 1, 1]), // west
    new Float32Array([-1, -1, 2]), // north west
  ];

  private orientation: HexOrientation = 'pointy';

  /**
   * Set the orientation of the hex grid
   *
   * @param orientation - The orientation of the hex grid
   * @returns The orientation of the hex grid
   */
  public setOrientation = (orientation: HexOrientation): HexOrientation =>
    (this.orientation = orientation);

  /**
   * Get the orientation of the hex grid
   *
   * @returns The orientation of the hex grid
   */
  public getOrientation = (): HexOrientation => this.orientation;

  /**
   * Create a new cube coord
   *
   * @returns The new cube coord
   */
  public create = (): CubeCoord => new Float32Array(3);

  /**
   * Validate a cube coord
   *
   * @param a - The cube coord to validate
   * @returns Whether the cube coord is valid
   */
  public validate = (a: CubeCoord): boolean => Math.round(a[0] + a[1] + a[2]) === 0;

  /**
   * Create a cube coord from axial coordinates
   *
   * @param q - The q coordinate
   * @param r - The r coordinate
   * @param s - The s coordinate
   * @returns The cube coord
   */
  public from = (q: number, r: number, s: number): CubeCoord => {
    const cube = new Float32Array([q, r, s]);
    if (!this.validate(cube)) throw new Error('Invalid cube coord');
    return cube;
  };

  /**
   * Copy a cube coord
   *
   * @param out - The cube coord to copy to
   * @param a - The cube coord to copy
   * @returns The copied cube coord
   */
  public copy = (out: CubeCoord, a: CubeCoord): CubeCoord => {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  };

  /**
   * Clone a cube coord
   *
   * @param a - The cube coord to clone
   * @returns The cloned cube coord
   */
  public clone = (a: CubeCoord): CubeCoord => new Float32Array([a[0], a[1], a[2]]);

  /**
   * Set the values of a cube coord
   *
   * @param out - The cube coord to set the values of
   * @param q - The q coordinate
   * @param r - The r coordinate
   * @param s - The s coordinate
   * @returns The cube coord
   */
  public setValues = (out: CubeCoord, q: number, r: number, s: number): CubeCoord => {
    out[0] = q;
    out[1] = r;
    out[2] = s;
    if (!this.validate(out)) throw new Error('Invalid cube coord');
    return out;
  };

  /**
   * Check if two cube coords are equal
   *
   * @param a - The first cube coord
   * @param b - The second cube coord
   * @returns Whether the cube coords are equal
   */
  public equal = (a: CubeCoord, b: CubeCoord): boolean =>
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  /**
   * Add two cube coords
   *
   * @param out - The cube coord to store the result
   * @param a - The first cube coord
   * @param b - The second cube coord
   * @returns The cube coord
   */
  public add = (out: CubeCoord, a: CubeCoord, b: CubeCoord): CubeCoord => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  };

  /**
   * Subtract two cube coords
   *
   * @param out - The cube coord to store the result
   * @param minuend - The minuend cube coord
   * @param subtrahend - The subtrahend cube coord
   * @returns The cube coord
   */
  public subtract = (out: CubeCoord, minuend: CubeCoord, subtrahend: CubeCoord): CubeCoord => {
    out[0] = minuend[0] - subtrahend[0];
    out[1] = minuend[1] - subtrahend[1];
    out[2] = minuend[2] - subtrahend[2];
    return out;
  };

  /**
   * Round a cube coord
   *
   * @param out - The cube coord to round
   * @returns The rounded cube coord
   */
  public round = (out: CubeCoord): CubeCoord => {
    let q = Math.round(out[0]);
    let r = Math.round(out[1]);
    let s = Math.round(out[2]);
    const qDiff = Math.abs(q - out[0]);
    const rDiff = Math.abs(r - out[1]);
    const sDiff = Math.abs(s - out[2]);
    if (qDiff > rDiff && qDiff > sDiff) q = -r - s;
    else if (rDiff > sDiff) r = -q - s;
    else s = -q - r;
    out[0] = q;
    out[1] = r;
    out[2] = s;
    return out;
  };

  /**
   * Scale a cube coord
   *
   * @param out - The cube coord to store the result
   * @param a - The cube coord to scale
   * @param multiplier - The multiplier
   * @returns The cube coord
   */
  public scale = (out: CubeCoord, a: CubeCoord, multiplier: number): CubeCoord => {
    out[0] = a[0] * multiplier;
    out[1] = a[1] * multiplier;
    out[2] = a[2] * multiplier;
    return out;
  };

  /**
   * Get the distance between two cube coords
   *
   * @param a - The first cube coord
   * @param b - The second cube coord
   * @returns The distance between the cube coords
   */
  public distance = (a: CubeCoord, b: CubeCoord): number => {
    const vec = this.subtract(this.create(), a, b);
    return Math.max(Math.abs(vec[0]), Math.abs(vec[1]), Math.abs(vec[2]));
  };

  /**
   * Interpolate between two cube coords
   *
   * @param out - The cube coord to store the result
   * @param a - The first cube coord
   * @param b - The second cube coord
   * @param t - The interpolation value
   * @returns The cube coord
   */
  public lerp = (out: CubeCoord, a: CubeCoord, b: CubeCoord, t: number): CubeCoord => {
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
    out[2] = a[2] + (b[2] - a[2]) * t;
    return out;
  };

  /**
   * Get the direction vector between two cube coords
   *
   * @param origin - The origin cube coord
   * @param destination - The destination cube coord
   * @returns The direction vector between the cube coords
   */
  public directionBetweenCoords = (
    origin: CubeCoord,
    destination: CubeCoord
  ): CubeCoord | false => {
    //first we cero on origin
    const a = this.subtract(this.create(), destination, origin);

    const isSide = a.indexOf(0) !== -1;
    if (isSide) {
      for (let i = 0; i < a.length; i++) {
        if (a[i] === 0) continue;
        if (a[i] > 0) a[i] = 1;
        if (a[i] < 0) a[i] = -1;
      }
      return a;
    }

    const min = Math.min(...a.map(Math.abs));

    let minCount = 0;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i]) === min) minCount++;
      a[i] /= min;
    }

    // is not a diagonal or side
    if (minCount !== 2) return false;

    return a;
  };

  /**
   * Get the cube coord at a distance from an origin cube coord in a direction
   *
   * @param out - The cube coord to store the result
   * @param origin - The origin cube coord
   * @param direction - The direction cube coord
   * @param distance - The distance
   * @returns The cube coord
   */
  public getAtDistance = (
    out: CubeCoord,
    origin: CubeCoord,
    direction: CubeCoord,
    distance: number
  ): CubeCoord => {
    this.add(out, origin, this.scale(this.create(), direction, distance));
    return out;
  };

  /**
   * Get the path between two cube coords
   *
   * @param origin - The origin cube coord
   * @param destination - The destination cube coord
   * @returns The path between the cube coords
   */
  public path = (origin: CubeCoord, destination: CubeCoord): CubeCoord[] => {
    const N = this.distance(origin, destination);
    const results: CubeCoord[] = [];
    const bEpsilon = this.add(this.create(), destination, Cube.cubeEpsilon);
    for (let i = 0; i <= N; i++) {
      results.push(this.round(this.lerp(this.create(), origin, bEpsilon, (1 / N) * i)));
    }
    return results;
  };

  /**
   * Get the range of cube coords around a center cube coord
   *
   * @param center - The center cube coord
   * @param radius - The radius
   * @returns The range of cube coords
   */
  public range = (center: CubeCoord, radius: number): CubeCoord[] => {
    const results: CubeCoord[] = [];
    for (let q = 0 - radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        results.push(this.add(this.create(), center, this.from(q, r, -q - r)));
      }
    }
    return results;
  };

  /**
   * Intersect two cube coord lists, eg: ranges, spirals, rings, etc.
   *
   * @param a - The first range
   * @param b - The second range
   * @returns The intersection of the ranges
   */
  public intersection = (a: CubeCoord[], b: CubeCoord[]): CubeCoord[] =>
    a.filter((aCoord) => b.some((bCoord) => this.equal(aCoord, bCoord)));

  /**
   * Get the neighbor of a cube coord in a direction
   *
   * @param a - The cube coord
   * @param direction - Number between 0 and 5, starting from north(flat) or north east(pointy), and going clockwise
   * @returns The neighbor cube coord
   */
  public neighbor = (a: CubeCoord, direction: HexDirection): CubeCoord => {
    const sides = this.orientation === POINTY_TOP ? Cube.pointySides : Cube.flatSides;
    const sideVector = sides[direction];

    if (!sideVector) throw new Error('Invalid direction');

    return this.add(this.create(), a, sideVector);
  };

  /**
   * Get the diagonal neighbor of a cube coord in a direction
   *
   * @param a - The cube coord
   * @param direction - Number between 0 and 5, starting from north-east(flat) or north(pointy), and going clockwise
   * @returns The diagonal neighbor cube coord
   */
  public diagonalNeighbor = (a: CubeCoord, direction: HexDirection): CubeCoord => {
    const diagonals = this.orientation === POINTY_TOP ? Cube.pointyDiagonals : Cube.flatDiagonals;
    const diagonalVector = diagonals[direction];

    if (!diagonalVector) throw new Error('Invalid direction');

    return this.add(this.create(), a, diagonalVector);
  };

  /**
   * Rotates a cube coord clockwise 1/6 around a center cube coord
   *
   * @param out - The cube coord to store the result
   * @param a - The cube coord to rotate
   * @returns The rotated cube coord
   */
  public rotateCW = (out: CubeCoord, a: CubeCoord): CubeCoord => {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    out[0] = -a1;
    out[1] = -a2;
    out[2] = -a0;
    return out;
  };

  /**
   * Rotates a cube coord counter-clockwise 1/6 around a center cube coord
   *
   * @param out - The cube coord to store the result
   * @param a - The cube coord to rotate
   * @returns The rotated cube coord
   */
  public rotateCCW = (out: CubeCoord, a: CubeCoord): CubeCoord => {
    const aQ = a[0];
    const aR = a[1];
    const aS = a[2];
    out[0] = -aS;
    out[1] = -aQ;
    out[2] = -aR;
    return out;
  };

  /**
   * Reflects a cube coord over the Q axis
   *
   * @param out - The cube coord to store the result
   * @param a - The cube coord to reflect
   * @returns The reflected cube coord
   */
  public reflectQ = (out: CubeCoord, a: CubeCoord): CubeCoord => {
    out[0] = a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
  };

  /**
   * Reflects a cube coord over the R axis
   *
   * @param out - The cube coord to store the result
   * @param a - The cube coord to reflect
   * @returns The reflected cube coord
   */
  public reflectR = (out: CubeCoord, a: CubeCoord): CubeCoord => {
    out[0] = -a[0];
    out[1] = a[1];
    out[2] = -a[2];
    return out;
  };

  /**
   * Reflects a cube coord over the S axis
   *
   * @param out - The cube coord to store the result
   * @param a - The cube coord to reflect
   * @returns The reflected cube coord
   */
  public reflectS = (out: CubeCoord, a: CubeCoord): CubeCoord => {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = a[2];
    return out;
  };

  /**
   * Return the cube coords of the ring of radius around a cube coord
   *
   * @param a - The cube coord
   * @param radius - The radius
   * @returns The cube coords of the ring
   */
  public ring = (a: CubeCoord, radius: number): CubeCoord[] => {
    if (radius === 0) return [a];
    const results: CubeCoord[] = [];

    let hex = this.add(
      this.create(),
      a,
      this.scale(
        this.create(),
        this.orientation === POINTY_TOP ? Cube.pointySides[4] : Cube.flatSides[4],
        radius
      )
    );

    for (let directionI = 0; directionI < 6; directionI++) {
      for (let radiusI = 0; radiusI < radius; radiusI++) {
        hex = this.neighbor(hex, directionI as HexDirection);
        results.push(hex);
      }
    }

    return results;
  };

  /**
   * Return the cube coords of the spiral of radius around a cube coord
   *
   * @param a - The cube coord
   * @param radius - The radius
   * @returns The cube coords of the spiral
   */
  public spiral = (a: CubeCoord, radius: number): CubeCoord[] => {
    if (radius === 0) return [a];
    const results: CubeCoord[] = [a];
    for (let i = 1; i <= radius; i++) {
      results.push(...this.ring(a, i));
    }
    return results;
  };
}

export default new Cube();
