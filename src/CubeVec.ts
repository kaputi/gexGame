// TYPES /////////////////////////////////////////////////////
export type CubeVec = Float32Array;
type HexOrientation = 'pointy' | 'flat';
type NeighborType = 'side' | 'diagonal';
type HexDirection2 =
  | 'NORTH'
  | 'NORTH_EAST'
  | 'EAST'
  | 'SOUTH_EAST'
  | 'SOUTH'
  | 'SOUTH_WEST'
  | 'WEST'
  | 'NORTH_WEST';

// CONSTANTS /////////////////////////////////////////////////
// orientation
export const POINTY_TOP: HexOrientation = 'pointy';
export const FLAT_TOP: HexOrientation = 'flat';
// direction
export const NORTH: HexDirection2 = 'NORTH';
export const NORTH_EAST: HexDirection2 = 'NORTH_EAST';
export const EAST: HexDirection2 = 'EAST';
export const SOUTH_EAST: HexDirection2 = 'SOUTH_EAST';
export const SOUTH: HexDirection2 = 'SOUTH';
export const SOUTH_WEST: HexDirection2 = 'SOUTH_WEST';
export const WEST: HexDirection2 = 'WEST';
export const NORTH_WEST: HexDirection2 = 'NORTH_WEST';
// neighborType
export const NEIGHBOR_SIDE: NeighborType = 'side';
export const NEIGHBOR_DIAGONAL: NeighborType = 'diagonal';

class Cube {
  private static cubeEpsilon: CubeVec = new Float32Array([1e-6, 2e-6, -3e-6]);

  private static pointySides: Map<HexDirection2, CubeVec> = new Map([
    [NORTH_EAST, new Float32Array([1, -1, 0])],
    [EAST, new Float32Array([1, 0, -1])],
    [SOUTH_EAST, new Float32Array([0, 1, -1])],
    [SOUTH_WEST, new Float32Array([-1, 1, 0])],
    [WEST, new Float32Array([-1, 0, 1])],
    [NORTH_WEST, new Float32Array([0, -1, 1])],
  ]);

  private static pointyDiagonals: Map<HexDirection2, CubeVec> = new Map([
    [NORTH, new Float32Array([1, -2, 1])],
    [NORTH_EAST, new Float32Array([2, -1, -1])],
    [EAST, new Float32Array([1, 1, -2])],
    [SOUTH, new Float32Array([-1, 2, -1])],
    [SOUTH_WEST, new Float32Array([-2, 1, 1])],
    [NORTH_WEST, new Float32Array([-1, -1, 2])],
  ]);

  private static flatSides: Map<HexDirection2, CubeVec> = new Map([
    [NORTH, new Float32Array([0, -1, 1])],
    [NORTH_EAST, new Float32Array([1, -1, 0])],
    [SOUTH_EAST, new Float32Array([1, 0, -1])],
    [SOUTH, new Float32Array([0, 1, -1])],
    [SOUTH_WEST, new Float32Array([-1, 1, 0])],
    [NORTH_WEST, new Float32Array([-1, 0, 1])],
  ]);

  private static flatDiagonals: Map<HexDirection2, CubeVec> = new Map([
    [NORTH_EAST, new Float32Array([1, -2, 1])],
    [EAST, new Float32Array([2, -1, -1])],
    [SOUTH_EAST, new Float32Array([1, 1, -2])],
    [SOUTH_WEST, new Float32Array([-1, 2, -1])],
    [WEST, new Float32Array([-2, 1, 1])],
    [NORTH_WEST, new Float32Array([-1, -1, 2])],
  ]);

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
   * Create a new cube vector
   *
   * @returns The new cube vector
   */
  public create = (): CubeVec => new Float32Array(3);

  /**
   * Validate a cube vector
   *
   * @param a - The cube vector to validate
   * @returns Whether the cube vector is valid
   */
  public validate = (a: CubeVec): boolean => Math.round(a[0] + a[1] + a[2]) === 0;

  /**
   * Create a cube vector from axial coordinates
   *
   * @param q - The q coordinate
   * @param r - The r coordinate
   * @param s - The s coordinate
   * @returns The cube vector
   */
  public from = (q: number, r: number, s: number): CubeVec => {
    const cube = new Float32Array([q, r, s]);
    if (!this.validate(cube)) throw new Error('Invalid cube vector');
    return cube;
  };

  /**
   * Copy a cube vector
   *
   * @param out - The cube vector to copy to
   * @param a - The cube vector to copy
   * @returns The copied cube vector
   */
  public copy = (out: CubeVec, a: CubeVec): CubeVec => {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  };

  /**
   * Clone a cube vector
   *
   * @param a - The cube vector to clone
   * @returns The cloned cube vector
   */
  public clone = (a: CubeVec): CubeVec => new Float32Array([a[0], a[1], a[2]]);

  /**
   * Set the values of a cube vector
   *
   * @param out - The cube vector to set the values of
   * @param q - The q coordinate
   * @param r - The r coordinate
   * @param s - The s coordinate
   * @returns The cube vector
   */
  public setValues = (out: CubeVec, q: number, r: number, s: number): CubeVec => {
    out[0] = q;
    out[1] = r;
    out[2] = s;
    if (!this.validate(out)) throw new Error('Invalid cube vector');
    return out;
  };

  /**
   * Check if two cube vectors are equal
   *
   * @param a - The first cube vector
   * @param b - The second cube vector
   * @returns Whether the cube vectors are equal
   */
  public equal = (a: CubeVec, b: CubeVec): boolean =>
    a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  /**
   * Add two cube vectors
   *
   * @param out - The cube vector to store the result
   * @param a - The first cube vector
   * @param b - The second cube vector
   * @returns The cube vector
   */
  public add = (out: CubeVec, a: CubeVec, b: CubeVec): CubeVec => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  };

  /**
   * Subtract two cube vectors
   *
   * @param out - The cube vector to store the result
   * @param minuend - The minuend cube vector
   * @param subtrahend - The subtrahend cube vector
   * @returns The cube vector
   */
  public subtract = (out: CubeVec, minuend: CubeVec, subtrahend: CubeVec): CubeVec => {
    out[0] = minuend[0] - subtrahend[0];
    out[1] = minuend[1] - subtrahend[1];
    out[2] = minuend[2] - subtrahend[2];
    return out;
  };

  /**
   * Round a cube vector
   *
   * @param out - The cube vector to round
   * @returns The rounded cube vector
   */
  public round = (out: CubeVec): CubeVec => {
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
   * Scale a cube vector
   *
   * @param out - The cube vector to store the result
   * @param a - The cube vector to scale
   * @param multiplier - The multiplier
   * @returns The cube vector
   */
  public scale = (out: CubeVec, a: CubeVec, multiplier: number): CubeVec => {
    out[0] = a[0] * multiplier;
    out[1] = a[1] * multiplier;
    out[2] = a[2] * multiplier;
    return out;
  };

  /**
   * Get the distance between two cube vectors
   *
   * @param a - The first cube vector
   * @param b - The second cube vector
   * @returns The distance between the cube vectors
   */
  public distance = (a: CubeVec, b: CubeVec): number => {
    const vec = this.subtract(this.create(), a, b);
    return Math.max(Math.abs(vec[0]), Math.abs(vec[1]), Math.abs(vec[2]));
  };

  /**
   * Interpolate between two cube vectors
   *
   * @param out - The cube vector to store the result
   * @param a - The first cube vector
   * @param b - The second cube vector
   * @param t - The interpolation value
   * @returns The cube vector
   */
  public lerp = (out: CubeVec, a: CubeVec, b: CubeVec, t: number): CubeVec => {
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
    out[2] = a[2] + (b[2] - a[2]) * t;
    return out;
  };

  /**
   * Get the path between two cube vectors
   *
   * @param origin - The origin cube vector
   * @param destination - The destination cube vector
   * @returns The path between the cube vectors
   */
  public path = (origin: CubeVec, destination: CubeVec): CubeVec[] => {
    const N = this.distance(origin, destination);
    const results: CubeVec[] = [];
    const bEpsilon = this.add(this.create(), destination, Cube.cubeEpsilon);
    for (let i = 0; i <= N; i++) {
      results.push(this.round(this.lerp(this.create(), origin, bEpsilon, (1 / N) * i)));
    }
    return results;
  };

  /**
   * Get the range of cube vectors around a center cube vector
   *
   * @param center - The center cube vector
   * @param radius - The radius
   * @returns The range of cube vectors
   */
  public range = (center: CubeVec, radius: number): CubeVec[] => {
    const results: CubeVec[] = [];
    for (let q = 0 - radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        results.push(this.add(this.create(), center, this.from(q, r, -q - r)));
      }
    }
    return results;
  };

  /**
   * Intersect two cube vector lists, eg: ranges, spirals, rings, etc.
   *
   * @param a - The first range
   * @param b - The second range
   * @returns The intersection of the ranges
   */
  public intersection = (a: CubeVec[], b: CubeVec[]): CubeVec[] =>
    a.filter((aCoord) => b.some((bCoord) => this.equal(aCoord, bCoord)));

  /**
   * Get the direction vector and the neighborType between two cube vectors
   *
   * @param origin - The origin cube vector
   * @param destination - The destination cube vector
   * @returns The direction vector and neighbor type, returns false if the coords are not side, or diagonal
   */
  public directionBetweenCoords = (
    origin: CubeVec,
    destination: CubeVec
  ): { vector: CubeVec; neighborType: NeighborType } | false => {
    //first we cero on origin
    const a = this.subtract(this.create(), destination, origin);

    const isSide = a.indexOf(0) !== -1;
    if (isSide) {
      for (let i = 0; i < a.length; i++) {
        if (a[i] === 0) continue;
        if (a[i] > 0) a[i] = 1;
        if (a[i] < 0) a[i] = -1;
      }
      return { vector: a, neighborType: NEIGHBOR_SIDE };
    }

    const min = Math.min(...a.map(Math.abs));

    let minCount = 0;
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i]) === min) minCount++;
      a[i] /= min;
    }

    // is not a diagonal or side
    if (minCount !== 2) return false;

    return { vector: a, neighborType: NEIGHBOR_DIAGONAL };
  };

  /**
   * Get the cube vector at a distance from an origin cube vector in a direction
   *
   * @param out - The cube vector to store the result
   * @param origin - The origin cube vector
   * @param direction - The direction cube vector
   * @param distance - The distance
   * @returns The cube vector
   */
  public getAtDistance = (
    out: CubeVec,
    origin: CubeVec,
    direction: CubeVec | HexDirection2,
    distance: number
  ): CubeVec => {
    if (typeof direction === 'string') {
      const sides = this.orientation === POINTY_TOP ? Cube.pointySides : Cube.flatSides;
      const diagonals = this.orientation === POINTY_TOP ? Cube.pointyDiagonals : Cube.flatDiagonals;

      const directionVector =
        sides.get(direction as HexDirection2) || diagonals.get(direction as HexDirection2);
      this.add(out, origin, this.scale(this.create(), directionVector!, distance));
    } else {
      this.add(out, origin, this.scale(this.create(), direction, distance));
    }
    return out;
  };

  /**
   * Get the neighbor of a cube vector in a direction
   *
   * @param a - The cube vector
   * @param direction - Number between 0 and 5, starting from north(flat) or north east(pointy), and going clockwise
   * @returns The neighbor cube vector
   */
  public neighbor = (a: CubeVec, direction: HexDirection2): CubeVec => {
    const sides = this.orientation === POINTY_TOP ? Cube.pointySides : Cube.flatSides;
    const sideVector = sides.get(direction);
    if (!sideVector) throw new Error('Invalid direction');

    return this.add(this.create(), a, sideVector);
  };

  /**
   * Get the diagonal neighbor of a cube vector in a direction
   *
   * @param a - The cube vector
   * @param direction - Number between 0 and 5, starting from north-east(flat) or north(pointy), and going clockwise
   * @returns The diagonal neighbor cube vector
   */
  public diagonalNeighbor = (a: CubeVec, direction: HexDirection2): CubeVec => {
    const diagonals = this.orientation === POINTY_TOP ? Cube.pointyDiagonals : Cube.flatDiagonals;
    const diagonalVector = diagonals.get(direction);

    if (!diagonalVector) throw new Error('Invalid direction');

    return this.add(this.create(), a, diagonalVector);
  };

  /**
   * Rotates a cube vector clockwise 1/6 around a center cube vector
   *
   * @param out - The cube vector to store the result
   * @param a - The cube vector to rotate
   * @returns The rotated cube vector
   */
  public rotateCW = (out: CubeVec, a: CubeVec): CubeVec => {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    out[0] = -a1;
    out[1] = -a2;
    out[2] = -a0;
    return out;
  };

  /**
   * Rotates a cube vector counter-clockwise 1/6 around a center cube vector
   *
   * @param out - The cube vector to store the result
   * @param a - The cube vector to rotate
   * @returns The rotated cube vector
   */
  public rotateCCW = (out: CubeVec, a: CubeVec): CubeVec => {
    const aQ = a[0];
    const aR = a[1];
    const aS = a[2];
    out[0] = -aS;
    out[1] = -aQ;
    out[2] = -aR;
    return out;
  };

  /**
   * Reflects a cube vector over the Q axis
   *
   * @param out - The cube vector to store the result
   * @param a - The cube vector to reflect
   * @returns The reflected cube vector
   */
  public reflectQ = (out: CubeVec, a: CubeVec): CubeVec => {
    const aR = a[1];
    out[0] = a[0];
    out[1] = a[2];
    out[2] = aR;
    return out;
  };

  /**
   * Reflects a cube vector over the R axis
   *
   * @param out - The cube vector to store the result
   * @param a - The cube vector to reflect
   * @returns The reflected cube vector
   */
  public reflectR = (out: CubeVec, a: CubeVec): CubeVec => {
    const aQ = a[0];
    out[0] = a[2];
    out[1] = a[1];
    out[2] = aQ;
    return out;
  };

  /**
   * Reflects a cube vector over the S axis
   *
   * @param out - The cube vector to store the result
   * @param a - The cube vector to reflect
   * @returns The reflected cube vector
   */
  public reflectS = (out: CubeVec, a: CubeVec): CubeVec => {
    const aQ = a[0];
    out[0] = a[1];
    out[1] = aQ;
    out[2] = a[2];
    return out;
  };

  /**
   * Return the cube vectors of the ring of radius around a cube vector
   *
   * @param a - The cube vector
   * @param radius - The radius
   * @returns The cube vectors of the ring
   */
  public ring = (a: CubeVec, radius: number): CubeVec[] => {
    if (radius === 0) return [a];
    const results: CubeVec[] = [];

    let directions: Map<HexDirection2, CubeVec>;
    let start: HexDirection2;
    if (this.orientation === POINTY_TOP) {
      directions = Cube.pointySides;
      start = WEST;
    } else {
      directions = Cube.flatSides;
      start = SOUTH_WEST;
    }

    let hex = this.add(this.create(), a, this.scale(this.create(), directions.get(start)!, radius));

    for (const [direction] of directions) {
      for (let i = 0; i < radius; i++) {
        hex = this.neighbor(hex, direction);
        results.push(hex);
      }
    }

    return results;
  };

  /**
   * Return the cube vectors of the spiral of radius around a cube vector
   *
   * @param a - The cube vector
   * @param radius - The radius
   * @returns The cube vectors of the spiral
   */
  public spiral = (a: CubeVec, radius: number): CubeVec[] => {
    if (radius === 0) return [a];
    const results: CubeVec[] = [a];
    for (let i = 1; i <= radius; i++) {
      results.push(...this.ring(a, i));
    }
    return results;
  };
}

export const cubeVec = new Cube();
