import {
  DirectionMap,
  CubeCoord,
  AxialCoord,
  NeighborType,
  HexDirection,
  HexOrientation,
} from './types';

import {
  SOUTH_WEST,
  WEST,
  NEIGHBOR_SIDE,
  NEIGHBOR_DIAGONAL,
  POINTY_TOP,
  pointySides,
  flatSides,
  pointyDiagonals,
  flatDiagonals,
} from './constants';

const cubeEpsilon: CubeCoord = [1e-6, 2e-6, -3e-6];

/**
 * Hexagon cube coordinate utilities
 *
 * @module cubeCoord
 */

/**
 * Create a new hex cube vector
 *
 * @returns The new hex cube vector
 */
export const create = (): CubeCoord => [0, 0, 0];

/**
 * Validate a hex cube vector
 *
 * @param a - The hex cube vector to validate
 * @returns Whether the hex cube vector is valid
 */
export const validate = (a: CubeCoord): boolean => Math.round(a[0] + a[1] + a[2]) === 0;

/**
 * Create a hex cube vector from coordinates
 *
 * @param q - The q coordinate
 * @param r - The r coordinate
 * @param s - The s coordinate
 * @returns The hex cube vector
 */
export const fromValues = (q: number, r: number, s: number): CubeCoord => {
  const cube: CubeCoord = [q, r, s];
  if (!validate(cube)) throw new Error('Invalid hex cube vector');
  return cube;
};

/**
 * Convert a hex cube vector to an axial vector
 *
 * @param a - The hex cube vector
 * @returns The axial vector
 */
export const toAxial = (out: AxialCoord, a: CubeCoord): AxialCoord => {
  out[0] = a[0];
  out[1] = a[1];
  return out;
};

/**
 * Convert an axial vector to a hex cube vector
 *
 * @param out - The hex cube vector to store the result
 * @param a - The axial vector
 * @returns The hex cube vector
 */
export const fromAxial = (out: CubeCoord, a: AxialCoord): CubeCoord => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = -a[0] - a[1];
  return out;
};

/**
 * Copy a hex cube vector
 *
 * @param out - The hex cube vector to copy to
 * @param a - The hex cube vector to copy
 * @returns The copied hex cube vector
 */
export const copy = (out: CubeCoord, a: CubeCoord): CubeCoord => {
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
export const clone = (a: CubeCoord): CubeCoord => [a[0], a[1], a[2]];

/**
 * Set the values of a hex cube vector
 *
 * @param out - The hex cube vector to set the values of
 * @param q - The q coordinate
 * @param r - The r coordinate
 * @param s - The s coordinate
 * @returns The hex cube vector
 */
export const setValues = (out: CubeCoord, q: number, r: number, s: number): CubeCoord => {
  out[0] = q;
  out[1] = r;
  out[2] = s;
  if (!validate(out)) throw new Error('Invalid hex cube vector');
  return out;
};

/**
 * Check if two hex cube vectors are equal
 *
 * @param a - The first hex cube vector
 * @param b - The second hex cube vector
 * @returns Whether the hex cube vectors are equal
 */
export const equal = (a: CubeCoord, b: CubeCoord): boolean =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/**
 * Add two hex cube vectors
 *
 * @param out - The hex cube vector to store the result
 * @param a - The first hex cube vector
 * @param b - The second hex cube vector
 * @returns The hex cube vector
 */
export const add = (out: CubeCoord, a: CubeCoord, b: CubeCoord): CubeCoord => {
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
export const subtract = (out: CubeCoord, minuend: CubeCoord, subtrahend: CubeCoord): CubeCoord => {
  out[0] = minuend[0] - subtrahend[0];
  out[1] = minuend[1] - subtrahend[1];
  out[2] = minuend[2] - subtrahend[2];
  return out;
};

/**
 * Round a hex cube vector
 *
 * @param out - The hex cube vector to round
 * @param a - The hex cube vector to round
 * @returns The rounded hex cube vector
 */
export const round = (out: CubeCoord, a: CubeCoord): CubeCoord => {
  let q = Math.round(a[0]);
  let r = Math.round(a[1]);
  let s = Math.round(a[2]);
  const qDiff = Math.abs(q - a[0]);
  const rDiff = Math.abs(r - a[1]);
  const sDiff = Math.abs(s - a[2]);
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
export const scale = (out: CubeCoord, a: CubeCoord, multiplier: number): CubeCoord => {
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
export const distance = (a: CubeCoord, b: CubeCoord): number => {
  const vec = subtract(create(), a, b);
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
export const lerp = (out: CubeCoord, a: CubeCoord, b: CubeCoord, t: number): CubeCoord => {
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
export const path = (origin: CubeCoord, destination: CubeCoord): CubeCoord[] => {
  const N = distance(origin, destination);
  const results: CubeCoord[] = [];
  const bEpsilon = add(create(), destination, cubeEpsilon);

  for (let i = 0; i <= N; i++) {
    const a = create();
    results.push(round(a, lerp(a, origin, bEpsilon, (1 / N) * i)));
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
export const range = (center: CubeCoord, radius: number): CubeCoord[] => {
  const results: CubeCoord[] = [];
  for (let q = 0 - radius; q <= radius; q++) {
    for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
      results.push(add(create(), center, fromValues(q, r, -q - r)));
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
export const directionBetweenCoords = (
  origin: CubeCoord,
  destination: CubeCoord
): { vector: CubeCoord; neighborType: NeighborType } | false => {
  //first we cero on origin
  const a = subtract(create(), destination, origin);

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
export const getAtDistance = (
  out: CubeCoord,
  origin: CubeCoord,
  direction: CubeCoord | HexDirection,
  distance: number,
  orientation: HexOrientation = POINTY_TOP
): CubeCoord => {
  if (typeof direction === 'string') {
    const sides = orientation === POINTY_TOP ? pointySides : flatSides;
    const diagonals = orientation === POINTY_TOP ? pointyDiagonals : flatDiagonals;

    const directionVector =
      sides.get(direction as HexDirection) || diagonals.get(direction as HexDirection);
    add(out, origin, scale(create(), directionVector!, distance));
  } else {
    add(out, origin, scale(create(), direction, distance));
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
export const neighbor = (
  out: CubeCoord,
  a: CubeCoord,
  direction: HexDirection,
  orientation: HexOrientation = POINTY_TOP
): CubeCoord => {
  const sides = orientation === POINTY_TOP ? pointySides : flatSides;
  const sideVector = sides.get(direction);
  if (!sideVector) throw new Error('Invalid direction');

  return add(out, a, sideVector);
};

/**
 * Get the diagonal neighbor of a hex cube vector in a direction
 *
 * @param a - The hex cube vector
 * @param direction - Number between 0 and 5, starting from north-east(flat) or north(pointy), and going clockwise
 * @returns The diagonal neighbor hex cube vector
 */
export const diagonalNeighbor = (
  out: CubeCoord,
  a: CubeCoord,
  direction: HexDirection,
  orientation: HexOrientation = POINTY_TOP
): CubeCoord => {
  const diagonals = orientation === POINTY_TOP ? pointyDiagonals : flatDiagonals;
  const diagonalVector = diagonals.get(direction);

  if (!diagonalVector) throw new Error('Invalid direction');

  return add(out, a, diagonalVector);
};

/**
 * Rotates a hex cube vector clockwise 1/6 around a center hex cube vector
 *
 * @param out - The hex cube vector to store the result
 * @param a - The hex cube vector to rotate
 * @returns The rotated hex cube vector
 */
export const rotateCW = (out: CubeCoord, a: CubeCoord): CubeCoord => {
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
export const rotateCCW = (out: CubeCoord, a: CubeCoord): CubeCoord => {
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
export const reflectQ = (out: CubeCoord, a: CubeCoord): CubeCoord => {
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
export const reflectR = (out: CubeCoord, a: CubeCoord): CubeCoord => {
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
export const reflectS = (out: CubeCoord, a: CubeCoord): CubeCoord => {
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
export const ring = (
  a: CubeCoord,
  radius: number,
  orientation: HexOrientation = POINTY_TOP
): CubeCoord[] => {
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

  let hex = add(create(), a, scale(create(), directions.get(start)!, radius));

  for (const [direction] of directions) {
    for (let i = 0; i < radius; i++) {
      hex = neighbor(create(), hex, direction);
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
export const spiral = (
  a: CubeCoord,
  radius: number,
  orientation: HexOrientation = POINTY_TOP
): CubeCoord[] => {
  if (radius === 0) return [a];
  const results: CubeCoord[] = [a];
  for (let i = 1; i <= radius; i++) {
    results.push(...ring(a, i, orientation));
  }
  return results;
};

/**
 * Convert a vec to string
 *
 * @param a - The vec to convert
 * @returns The string
 */
export const toString = (a: CubeCoord): string => {
  // if (a[0] === -0) a[0] = 0;
  // if (a[1] === -0) a[1] = 0;
  // if (a[2] === -0) a[2] = 0;
  return `${a[0].toFixed(0)},${a[1].toFixed(0)},${a[2].toFixed(0)}`;
};
