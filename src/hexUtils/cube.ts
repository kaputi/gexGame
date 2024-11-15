import {
  cubeEpsilon,
  flatDiagonals,
  flatSides,
  NEIGHBOR_DIAGONAL,
  NEIGHBOR_SIDE,
  POINTY_TOP,
  pointyDiagonals,
  pointySides,
  SOUTH_WEST,
  WEST,
} from './constants';

/**
 * Cube hexagon coordinate utilities
 *
 * @module cube
 */

/**
 * Creates a empty hex cube coordinate
 *
 * @returns A new hex cube coordinate
 */
export const create = (): CubeCoord => {
  const out = new Float32Array(3);
  return out;
};

/**
 * Check if a hex cube coordinate is valid
 *
 * @param a - The hex cube coordinate to validate
 * @returns True if the hex cube coordinate is valid, false otherwise
 */
export const validate = (a: CubeCoord): boolean => Math.round(a[0] + a[1] + a[2]) === 0;

/**
 * Creates a hex cube coordinate from values
 *
 * @param q - The q value
 * @param r - The r value
 * @param s - The s value
 * @returns A new hex cube coordinate
 */
export const fromValues = (q: number, r: number, s: number): CubeCoord => {
  const out = new Float32Array(3);
  out[0] = q;
  out[1] = r;
  out[2] = s;
  if (!validate(out)) throw new Error('q + r + s must be 0');
  return out;
};

/**
 * Set the values of a hex cube coordinate
 *
 * @param q - The q value
 * @param r - The r value
 * @param s - The s value
 * @param out - The hex cube coordinate to set the values of
 */
export const setValues = (q: number, r: number, s: number, out: CubeCoord): CubeCoord => {
  out[0] = q;
  out[1] = r;
  out[2] = s;
  if (!validate(out)) throw new Error('q + r + s must be 0');
  return out;
};

/**
 * Copy a hex cube coordinate
 *
 * @param a - The hex cube coordinate to copy
 * @param [out] - The hex cube coordinate to copy into, if not provided a new hex cube coordinate is created
 * @returns The copied hex cube coordinate
 */
export const copy = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};

/**
 * Convert a hex axial coordinate to a hex cube coordinate
 *
 * @param a - The hex axial coordinate to convert
 * @param [out] - The hex cube coordinate to convert into, if not provided a new hex cube coordinate is created
 * @returns The converted hex cube coordinate
 */
export const fromAxial = (a: AxialCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = -a[0] - a[1];
  return out;
};

/**
 * Check if two hex cube coordinates are equal
 *
 * @param a - The first hex cube coordinate
 * @param b - The second hex cube coordinate
 * @returns True if the hex cube coordinates are equal, false otherwise
 */
export const equal = (a: CubeCoord, b: CubeCoord): boolean =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
/** Alias for equal */
export const eq = equal;

/**
 * Convert a hex cube coordinate to a hex axial coordinate
 *
 * @param a - The hex cube coordinate to convert
 * @param [out] - The hex axial coordinate to convert into, if not provided a new hex axial coordinate is created
 * @returns The converted hex axial coordinate
 */
export const toAxial = (a: CubeCoord, out?: AxialCoord): AxialCoord => {
  if (!out) out = new Float32Array(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
};

/**
 * Add two hex cube coordinates
 *
 * @param a - The first hex cube coordinate
 * @param b - The second hex cube coordinate
 * @param [out] - The hex cube coordinate to add into, if not provided a new hex cube coordinate is created
 */
export const add = (a: CubeCoord, b: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);

  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];

  return out;
};

/**
 * Subtract two hex cube coordinates*
 *
 * @param a - The first hex cube coordinate
 * @param b - The second hex cube coordinate
 * @param [out] - The hex cube coordinate to subtract into, if not provided a new hex cube coordinate is created
 */
export const subtract = (a: CubeCoord, b: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);

  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];

  return out;
};

/** Alias for subtract */
export const sub = subtract;

/**
 * Scale a hex cube coordinate
 *
 * @param a - The hex cube coordinate to scale
 * @param k - The scale factor
 * @param [out] - The hex cube coordinate to scale into, if not provided a new hex cube coordinate is created
 * @returns The scaled hex cube coordinate
 */
export const scale = (a: CubeCoord, k: number, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);

  out[0] = a[0] * k;
  out[1] = a[1] * k;
  out[2] = a[2] * k;

  return out;
};
/** Alias for scale */
export const mul = scale;
/** Alias for scale */
export const multiply = scale;

/**
 * Round a hex cube coordinate
 *
 * @param a - The hex cube coordinate to round
 * @param [out] - The hex cube coordinate to round into, if not provided a new hex cube coordinate is created
 * @returns The rounded hex cube coordinate
 */
export const round = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  let q = Math.round(a[0]);
  let r = Math.round(a[1]);
  let s = Math.round(a[2]);
  const qDiff = Math.abs(q - a[0]);
  const rDiff = Math.abs(r - a[1]);
  const sDiff = Math.abs(s - a[2]);
  if (qDiff > rDiff && qDiff > sDiff) q = -r - s;
  else if (rDiff > sDiff) r = -q - s;
  else s = -q - r;
  if (!out) out = new Float32Array(3);
  out[0] = q;
  out[1] = r;
  out[2] = s;
  return out;
};

/**
 * Get the distance in hexes between two hex cube coordinates
 *
 * @param a - The first hex cube coordinate
 * @param b - The second hex cube coordinate
 * @returns The distance in hexes between the two hex cube coordinates
 */
export const distance = (a: CubeCoord, b: CubeCoord): number => {
  const vec = subtract(a, b);
  return Math.max(Math.abs(vec[0]), Math.abs(vec[1]), Math.abs(vec[2]));
};

/**
 * Linear interpolation between two hex cube coordinates
 *
 * @param a - The first hex cube coordinate
 * @param b - The second hex cube coordinate
 * @param t - The interpolation value
 * @param [out] - The hex cube coordinate to store the result, if not provided a new hex cube coordinate is created
 */
export const lerp = (a: CubeCoord, b: CubeCoord, t: number, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);

  out[0] = a[0] + (b[0] - a[0]) * t;
  out[1] = a[1] + (b[1] - a[1]) * t;
  out[2] = a[2] + (b[2] - a[2]) * t;

  return out;
};

/**
 * Get the path between two hex cube coordinates
 *
 * @param origin - The origin hex cube coordinate
 * @param destination - The destination hex cube coordinate
 * @returns The path between the hex cube coordinates
 */
export const path = (origin: CubeCoord, destination: CubeCoord): CubeCoord[] => {
  const N = distance(origin, destination);
  const results: CubeCoord[] = [];
  const bEpsilon = add(destination, cubeEpsilon);

  for (let i = 0; i <= N; i++) {
    const a = new Float32Array(3);
    results.push(round(lerp(origin, bEpsilon, (1 / N) * i, a), a));
  }

  return results;
};
/** Alias for path */
export const line = path;

/**
 * Get the range of hex cube vectors around a center hex cube vector
 *
 * @param center - The center hex cube vector
 * @param radius - The radius
 * @returns The range of hex cube vectors
 */
export const range = (center: CubeCoord, radius: number): CubeCoord[] => {
  const results: CubeCoord[] = [];
  for (let q = 0 - radius; q <= radius; q++) {
    for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
      results.push(add(center, fromValues(q, r, -q - r)));
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
export const intersection = (a: CubeCoord[], b: CubeCoord[]): CubeCoord[] =>
  a.filter((aCoord) => b.some((bCoord) => equal(aCoord, bCoord)));

/**
 * Get the direction vector and the neighborType between two hex cube vectors
 *
 * @param origin - The origin hex cube vector
 * @param destination - The destination hex cube vector
 * @returns The direction vector and neighbor type, returns false if the coords are not side, or diagonal
 */
export const directionBetween = (
  origin: CubeCoord,
  destination: CubeCoord
): { directionVector: CubeCoord; neighborType: NeighborType } | false => {
  //first we cero on origin
  const a = sub(destination, origin);

  const isSide = a[0] === 0 || a[1] === 0 || a[2] === 0;
  if (isSide) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] === 0) continue;
      if (a[i] > 0) a[i] = 1;
      if (a[i] < 0) a[i] = -1;
    }
    return { directionVector: a, neighborType: NEIGHBOR_SIDE };
  }

  const min = Math.min(Math.abs(a[0]), Math.abs(a[1]), Math.abs(a[2]));

  let minCount = 0;
  for (let i = 0; i < a.length; i++) {
    if (Math.abs(a[i]) === min) minCount++;
    a[i] /= min;
  }

  // is not a diagonal or side
  if (minCount !== 2) return false;

  return { directionVector: a, neighborType: NEIGHBOR_DIAGONAL };
};

/**
 * Get the hex cube vector at a distance from an origin hex cube vector in a direction
 *
 * @param origin - The origin hex cube vector
 * @param direction - The direction hex cube vector
 * @param distance - The distance
 * @param orientation - The orientation of the hex grid
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The hex cube vector
 */
export const getAtDistance = (
  origin: CubeCoord,
  direction: CubeCoord | HexDirection,
  distance: number,
  orientation: HexOrientation,
  out?: CubeCoord
): CubeCoord => {
  if (!out) out = new Float32Array(3);
  if (typeof direction === 'string') {
    const sides = orientation === POINTY_TOP ? pointySides : flatSides;
    const diagonals = orientation === POINTY_TOP ? pointyDiagonals : flatDiagonals;

    const directionVector =
      sides.get(direction as HexDirection) || diagonals.get(direction as HexDirection);
    add(origin, scale(directionVector!, distance), out);
  } else {
    add(origin, scale(direction, distance), out);
  }
  return out;
};

/**
 * Get the neighbor of a hex cube coordinate in a given direction
 *
 * @param a - The hex cube coordinate to get the neighbor of
 * @param direction - The direction of the neighbor
 * @param orientation - The orientation of the hex grid
 * @param [out] - The hex cube coordinate to store the result, if not provided a new hex cube coordinate is created
 * @returns The neighbor hex cube coordinate
 */
export const neighbor = (
  a: CubeCoord,
  direction: HexDirection,
  orientation: HexOrientation,
  out?: CubeCoord
): CubeCoord => {
  if (!out) out = new Float32Array(3);
  const sides = orientation === POINTY_TOP ? pointySides : flatSides;
  const sideVector = sides.get(direction);
  if (!sideVector) throw new Error('Invalid direction');
  add(a, sideVector, out);
  return out;
};

/**
 * Get the diagonal neighbor of a hex cube vector in a direction
 *
 * @param a - The hex cube vector
 * @param direction - Number between 0 and 5, starting from north-east(flat) or north(pointy), and going clockwise
 * @param orientation - The orientation of the hex grid
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The diagonal neighbor hex cube vector
 */
export const diagonalNeighbor = (
  a: CubeCoord,
  direction: HexDirection,
  orientation: HexOrientation,
  out?: CubeCoord
): CubeCoord => {
  if (!out) out = new Float32Array(3);
  const diagonals = orientation === POINTY_TOP ? pointyDiagonals : flatDiagonals;
  const diagonalVector = diagonals.get(direction);

  if (!diagonalVector) throw new Error('Invalid direction');
  add(a, diagonalVector, out);
  return out;
};

/**
 * Rotates a hex cube vector clockwise 1/6 around origin
 *
 * @param a - The hex cube vector to rotate
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The rotated hex cube vector
 */
export const rotateCW = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
  const a0 = a[0];
  const a1 = a[1];
  const a2 = a[2];
  out[0] = -a1;
  out[1] = -a2;
  out[2] = -a0;
  return out;
};

/**
 * Rotates a hex cube vector counter-clockwise 1/6 around origin
 *
 * @param a - The hex cube vector to rotate
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The rotated hex cube vector
 */
export const rotateCCW = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
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
 * @param a - The hex cube vector to reflect
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The reflected hex cube vector
 */
export const reflectQ = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
  const aR = a[1];
  out[0] = a[0];
  out[1] = a[2];
  out[2] = aR;
  return out;
};

/**
 * Reflects a hex cube vector over the R axis
 *
 * @param a - The hex cube vector to reflect
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The reflected hex cube vector
 */
export const reflectR = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
  const aQ = a[0];
  out[0] = a[2];
  out[1] = a[1];
  out[2] = aQ;
  return out;
};

/**
 * Reflects a hex cube vector over the S axis
 *
 * @param a - The hex cube vector to reflect
 * @param [out] - The hex cube vector to store the result, if not provided a new hex cube vector is created
 * @returns The reflected hex cube vector
 */
export const reflectS = (a: CubeCoord, out?: CubeCoord): CubeCoord => {
  if (!out) out = new Float32Array(3);
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
 * @param orientation - The orientation of the hex grid
 * @returns The hex cube vectors of the ring
 */
export const ring = (a: CubeCoord, radius: number, orientation: HexOrientation): CubeCoord[] => {
  if (radius === 0) return [a];
  const results: CubeCoord[] = [];

  let directions: DirectionMap;
  let start: HexDirection;
  if (orientation === POINTY_TOP) {
    directions = pointySides;
    start = WEST;
  } else {
    directions = flatSides;
    start = SOUTH_WEST;
  }

  let hex = add(a, scale(directions.get(start)!, radius));

  for (const [direction] of directions) {
    for (let i = 0; i < radius; i++) {
      hex = neighbor(hex, direction, orientation);
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
 * @param orientation - The orientation of the hex grid
 * @returns The hex cube vectors of the spiral
 */
export const spiral = (a: CubeCoord, radius: number, orientation: HexOrientation): CubeCoord[] => {
  if (radius === 0) return [a];
  const results: CubeCoord[] = [a];
  for (let i = 1; i <= radius; i++) {
    results.push(...ring(a, i, orientation));
  }
  return results;
};

/**
 * Convert a hex coordinate to a string, if axial coordinate is provided it will be converted to a cube coordinate first
 *
 * @param a - The hex coordinate to convert
 * @returns The hex coordinate as a string
 */
export const toString = (a: CubeCoord): string => `${a[0]},${a[1]},${a[2]}`;
