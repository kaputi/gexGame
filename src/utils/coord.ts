// TYPES /////////////////////////////////////////////////////
type HexOrientation = 'pointy' | 'flat';
type NeighborType = 'side' | 'diagonal';
type HexDirection =
  | 'NORTH'
  | 'NORTH_EAST'
  | 'EAST'
  | 'SOUTH_EAST'
  | 'SOUTH'
  | 'SOUTH_WEST'
  | 'WEST'
  | 'NORTH_WEST';

export type Vec3 = [number, number, number];
export type Vec2 = [number, number];

// CONSTANTS /////////////////////////////////////////////////
// orientation
export const POINTY_TOP: HexOrientation = 'pointy';
export const FLAT_TOP: HexOrientation = 'flat';
// direction
export const NORTH: HexDirection = 'NORTH';
export const NORTH_EAST: HexDirection = 'NORTH_EAST';
export const EAST: HexDirection = 'EAST';
export const SOUTH_EAST: HexDirection = 'SOUTH_EAST';
export const SOUTH: HexDirection = 'SOUTH';
export const SOUTH_WEST: HexDirection = 'SOUTH_WEST';
export const WEST: HexDirection = 'WEST';
export const NORTH_WEST: HexDirection = 'NORTH_WEST';
// neighborType
export const NEIGHBOR_SIDE: NeighborType = 'side';
export const NEIGHBOR_DIAGONAL: NeighborType = 'diagonal';

class VecCube {
  private static cubeEpsilon: Vec3 = [1e-6, 2e-6, -3e-6];

  private static pointySides: Map<HexDirection, Vec3> = new Map([
    [NORTH_EAST, [1, -1, 0]],
    [EAST, [1, 0, -1]],
    [SOUTH_EAST, [0, 1, -1]],
    [SOUTH_WEST, [-1, 1, 0]],
    [WEST, [-1, 0, 1]],
    [NORTH_WEST, [0, -1, 1]],
  ]);

  private static pointyDiagonals: Map<HexDirection, Vec3> = new Map([
    [NORTH, [1, -2, 1]],
    [NORTH_EAST, [2, -1, -1]],
    [EAST, [1, 1, -2]],
    [SOUTH, [-1, 2, -1]],
    [SOUTH_WEST, [-2, 1, 1]],
    [NORTH_WEST, [-1, -1, 2]],
  ]);

  private static flatSides: Map<HexDirection, Vec3> = new Map([
    [NORTH, [0, -1, 1]],
    [NORTH_EAST, [1, -1, 0]],
    [SOUTH_EAST, [1, 0, -1]],
    [SOUTH, [0, 1, -1]],
    [SOUTH_WEST, [-1, 1, 0]],
    [NORTH_WEST, [-1, 0, 1]],
  ]);

  private static flatDiagonals: Map<HexDirection, Vec3> = new Map([
    [NORTH_EAST, [1, -2, 1]],
    [EAST, [2, -1, -1]],
    [SOUTH_EAST, [1, 1, -2]],
    [SOUTH_WEST, [-1, 2, -1]],
    [WEST, [-2, 1, 1]],
    [NORTH_WEST, [-1, -1, 2]],
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
   * Create a new hex cube vector
   *
   * @returns The new hex cube vector
   */
  public create = (): Vec3 => [0, 0, 0];

  /**
   * Validate a hex cube vector
   *
   * @param a - The hex cube vector to validate
   * @returns Whether the hex cube vector is valid
   */
  public validate = (a: Vec3): boolean => Math.round(a[0] + a[1] + a[2]) === 0;

  /**
   * Create a hex cube vector from axial coordinates
   *
   * @param q - The q coordinate
   * @param r - The r coordinate
   * @param s - The s coordinate
   * @returns The hex cube vector
   */
  public fromValues = (q: number, r: number, s: number): Vec3 => {
    const cube: Vec3 = [q, r, s];
    if (!this.validate(cube)) throw new Error('Invalid hex cube vector');
    return cube;
  };

  /**
   * Copy a hex cube vector
   *
   * @param out - The hex cube vector to copy to
   * @param a - The hex cube vector to copy
   * @returns The copied hex cube vector
   */
  public copy = (out: Vec3, a: Vec3): Vec3 => {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
  };

  /**
   * Clone a hex cube vector
   *
   * @param a - The hex cube vector to clone
   * @returns The cloned hex cube vector
   */
  public clone = (a: Vec3): Vec3 => [a[0], a[1], a[2]];

  /**
   * Set the values of a hex cube vector
   *
   * @param out - The hex cube vector to set the values of
   * @param q - The q coordinate
   * @param r - The r coordinate
   * @param s - The s coordinate
   * @returns The hex cube vector
   */
  public setValues = (out: Vec3, q: number, r: number, s: number): Vec3 => {
    out[0] = q;
    out[1] = r;
    out[2] = s;
    if (!this.validate(out)) throw new Error('Invalid hex cube vector');
    return out;
  };

  /**
   * Check if two hex cube vectors are equal
   *
   * @param a - The first hex cube vector
   * @param b - The second hex cube vector
   * @returns Whether the hex cube vectors are equal
   */
  public equal = (a: Vec3, b: Vec3): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

  /**
   * Add two hex cube vectors
   *
   * @param out - The hex cube vector to store the result
   * @param a - The first hex cube vector
   * @param b - The second hex cube vector
   * @returns The hex cube vector
   */
  public add = (out: Vec3, a: Vec3, b: Vec3): Vec3 => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  };

  /**
   * Subtract two hex cube vectors
   *
   * @param out - The hex cube vector to store the result
   * @param minuend - The minuend hex cube vector
   * @param subtrahend - The subtrahend hex cube vector
   * @returns The hex cube vector
   */
  public subtract = (out: Vec3, minuend: Vec3, subtrahend: Vec3): Vec3 => {
    out[0] = minuend[0] - subtrahend[0];
    out[1] = minuend[1] - subtrahend[1];
    out[2] = minuend[2] - subtrahend[2];
    return out;
  };

  /**
   * Round a hex cube vector
   *
   * @param out - The hex cube vector to round
   * @returns The rounded hex cube vector
   */
  public round = (out: Vec3): Vec3 => {
    // TODO: in and out
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
   * Scale a hex cube vector
   *
   * @param out - The hex cube vector to store the result
   * @param a - The hex cube vector to scale
   * @param multiplier - The multiplier
   * @returns The hex cube vector
   */
  public scale = (out: Vec3, a: Vec3, multiplier: number): Vec3 => {
    out[0] = a[0] * multiplier;
    out[1] = a[1] * multiplier;
    out[2] = a[2] * multiplier;
    return out;
  };

  /**
   * Get the distance between two hex cube vectors
   *
   * @param a - The first hex cube vector
   * @param b - The second hex cube vector
   * @returns The distance between the hex cube vectors
   */
  public distance = (a: Vec3, b: Vec3): number => {
    const vec = this.subtract(this.create(), a, b);
    return Math.max(Math.abs(vec[0]), Math.abs(vec[1]), Math.abs(vec[2]));
  };

  /**
   * Interpolate between two hex cube vectors
   *
   * @param out - The hex cube vector to store the result
   * @param a - The first hex cube vector
   * @param b - The second hex cube vector
   * @param t - The interpolation value
   * @returns The hex cube vector
   */
  public lerp = (out: Vec3, a: Vec3, b: Vec3, t: number): Vec3 => {
    out[0] = a[0] + (b[0] - a[0]) * t;
    out[1] = a[1] + (b[1] - a[1]) * t;
    out[2] = a[2] + (b[2] - a[2]) * t;
    return out;
  };

  /**
   * Get the path between two hex cube vectors
   *
   * @param origin - The origin hex cube vector
   * @param destination - The destination hex cube vector
   * @returns The path between the hex cube vectors
   */
  public path = (origin: Vec3, destination: Vec3): Vec3[] => {
    const N = this.distance(origin, destination);
    const results: Vec3[] = [];
    const bEpsilon = this.add(this.create(), destination, VecCube.cubeEpsilon);
    for (let i = 0; i <= N; i++) {
      results.push(this.round(this.lerp(this.create(), origin, bEpsilon, (1 / N) * i)));
    }
    return results;
  };

  /**
   * Get the range of hex cube vectors around a center hex cube vector
   *
   * @param center - The center hex cube vector
   * @param radius - The radius
   * @returns The range of hex cube vectors
   */
  public range = (center: Vec3, radius: number): Vec3[] => {
    const results: Vec3[] = [];
    for (let q = 0 - radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        results.push(this.add(this.create(), center, this.fromValues(q, r, -q - r)));
      }
    }
    return results;
  };

  /**
   * Intersect two hex cube vector lists, eg: ranges, spirals, rings, etc.
   *
   * @param a - The first range
   * @param b - The second range
   * @returns The intersection of the ranges
   */
  public intersection = (a: Vec3[], b: Vec3[]): Vec3[] =>
    a.filter((aCoord) => b.some((bCoord) => this.equal(aCoord, bCoord)));

  /**
   * Get the direction vector and the neighborType between two hex cube vectors
   *
   * @param origin - The origin hex cube vector
   * @param destination - The destination hex cube vector
   * @returns The direction vector and neighbor type, returns false if the coords are not side, or diagonal
   */
  public directionBetweenCoords = (
    origin: Vec3,
    destination: Vec3
  ): { vector: Vec3; neighborType: NeighborType } | false => {
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
   * Get the hex cube vector at a distance from an origin hex cube vector in a direction
   *
   * @param out - The hex cube vector to store the result
   * @param origin - The origin hex cube vector
   * @param direction - The direction hex cube vector
   * @param distance - The distance
   * @returns The hex cube vector
   */
  public getAtDistance = (
    out: Vec3,
    origin: Vec3,
    direction: Vec3 | HexDirection,
    distance: number
  ): Vec3 => {
    if (typeof direction === 'string') {
      const sides = this.orientation === POINTY_TOP ? VecCube.pointySides : VecCube.flatSides;
      const diagonals =
        this.orientation === POINTY_TOP ? VecCube.pointyDiagonals : VecCube.flatDiagonals;

      const directionVector =
        sides.get(direction as HexDirection) || diagonals.get(direction as HexDirection);
      this.add(out, origin, this.scale(this.create(), directionVector!, distance));
    } else {
      this.add(out, origin, this.scale(this.create(), direction, distance));
    }
    return out;
  };

  /**
   * Get the neighbor of a hex cube vector in a direction
   *
   * @param a - The hex cube vector
   * @param direction - Number between 0 and 5, starting from north(flat) or north east(pointy), and going clockwise
   * @returns The neighbor hex cube vector
   */
  public neighbor = (a: Vec3, direction: HexDirection): Vec3 => {
    const sides = this.orientation === POINTY_TOP ? VecCube.pointySides : VecCube.flatSides;
    const sideVector = sides.get(direction);
    if (!sideVector) throw new Error('Invalid direction');

    return this.add(this.create(), a, sideVector);
  };

  /**
   * Get the diagonal neighbor of a hex cube vector in a direction
   *
   * @param a - The hex cube vector
   * @param direction - Number between 0 and 5, starting from north-east(flat) or north(pointy), and going clockwise
   * @returns The diagonal neighbor hex cube vector
   */
  public diagonalNeighbor = (a: Vec3, direction: HexDirection): Vec3 => {
    const diagonals =
      this.orientation === POINTY_TOP ? VecCube.pointyDiagonals : VecCube.flatDiagonals;
    const diagonalVector = diagonals.get(direction);

    if (!diagonalVector) throw new Error('Invalid direction');

    return this.add(this.create(), a, diagonalVector);
  };

  /**
   * Rotates a hex cube vector clockwise 1/6 around a center hex cube vector
   *
   * @param out - The hex cube vector to store the result
   * @param a - The hex cube vector to rotate
   * @returns The rotated hex cube vector
   */
  public rotateCW = (out: Vec3, a: Vec3): Vec3 => {
    const a0 = a[0];
    const a1 = a[1];
    const a2 = a[2];
    out[0] = -a1;
    out[1] = -a2;
    out[2] = -a0;
    return out;
  };

  /**
   * Rotates a hex cube vector counter-clockwise 1/6 around a center hex cube vector
   *
   * @param out - The hex cube vector to store the result
   * @param a - The hex cube vector to rotate
   * @returns The rotated hex cube vector
   */
  public rotateCCW = (out: Vec3, a: Vec3): Vec3 => {
    const aQ = a[0];
    const aR = a[1];
    const aS = a[2];
    out[0] = -aS;
    out[1] = -aQ;
    out[2] = -aR;
    return out;
  };

  /**
   * Reflects a hex cube vector over the Q axis
   *
   * @param out - The hex cube vector to store the result
   * @param a - The hex cube vector to reflect
   * @returns The reflected hex cube vector
   */
  public reflectQ = (out: Vec3, a: Vec3): Vec3 => {
    const aR = a[1];
    out[0] = a[0];
    out[1] = a[2];
    out[2] = aR;
    return out;
  };

  /**
   * Reflects a hex cube vector over the R axis
   *
   * @param out - The hex cube vector to store the result
   * @param a - The hex cube vector to reflect
   * @returns The reflected hex cube vector
   */
  public reflectR = (out: Vec3, a: Vec3): Vec3 => {
    const aQ = a[0];
    out[0] = a[2];
    out[1] = a[1];
    out[2] = aQ;
    return out;
  };

  /**
   * Reflects a hex cube vector over the S axis
   *
   * @param out - The hex cube vector to store the result
   * @param a - The hex cube vector to reflect
   * @returns The reflected hex cube vector
   */
  public reflectS = (out: Vec3, a: Vec3): Vec3 => {
    const aQ = a[0];
    out[0] = a[1];
    out[1] = aQ;
    out[2] = a[2];
    return out;
  };

  /**
   * Return the hex cube vectors of the ring of radius around a hex cube vector
   *
   * @param a - The hex cube vector
   * @param radius - The radius
   * @returns The hex cube vectors of the ring
   */
  public ring = (a: Vec3, radius: number): Vec3[] => {
    if (radius === 0) return [a];
    const results: Vec3[] = [];

    let directions: Map<HexDirection, Vec3>;
    let start: HexDirection;
    if (this.orientation === POINTY_TOP) {
      directions = VecCube.pointySides;
      start = WEST;
    } else {
      directions = VecCube.flatSides;
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
   * Return the hex cube vectors of the spiral of radius around a hex cube vector
   *
   * @param a - The hex cube vector
   * @param radius - The radius
   * @returns The hex cube vectors of the spiral
   */
  public spiral = (a: Vec3, radius: number): Vec3[] => {
    if (radius === 0) return [a];
    const results: Vec3[] = [a];
    for (let i = 1; i <= radius; i++) {
      results.push(...this.ring(a, i));
    }
    return results;
  };

  /**
   * Convert a hex cube vector to an axial vector
   *
   * @param a - The hex cube vector
   * @returns The axial vector
   */
  public toAxial = (a: Vec3): Vec2 => [a[0], a[1]];

  /**
   * Convert an axial vector to a hex cube vector
   *
   * @param a - The axial vector
   * @returns The hex cube vector
   */
  public fromAxial = (a: Vec2): Vec3 => this.fromValues(a[0], a[1], -a[0] - a[1]);

  // function axial_round(hex):
  //     return cube_to_axial(cube_round(axial_to_cube(hex)))
  public roundAxial = (out: Vec2, a: Vec2): Vec2 => {
    const b = this.fromAxial(a);
    this.round(b);
    out = this.toAxial(b);
    return out;
  };
}

export const vecCube = new VecCube();
