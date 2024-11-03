/**
 * Hexagon axial coordinate utilities
 *
 * @module cubeCoord
 */

import { cubeCoord } from '.';
import { AxialCoord, CubeCoord } from './types';

// TODO:
// - FromCube
// - ToCube

/**
 * Create a new axial coordinate.
 *
 * @returns {AxialCoord} A new axial coordinate.
 */
export const create = (): AxialCoord => [0, 0];

/**
 * Set the values of an axial coordinate.
 *
 * @param out - The receiving axial coordinate.
 * @param x - The x value.
 */
export const fromValues = (x: number, y: number): AxialCoord => [x, y];

/**
 * Set the values of an axial coordinate.
 *
 * @param out - The receiving axial coordinate.
 * @param x - The x value.
 */
export const setValues = (out: AxialCoord, x: number, y: number): AxialCoord => {
  out[0] = x;
  out[1] = y;
  return out;
};

/**
 * Copy the values from one axial coordinate to another.
 *
 * @param out - The receiving axial coordinate.
 * @param a - The source axial coordinate.
 * @returns The axial coordinate out.
 */
export const copy = (out: AxialCoord, a: AxialCoord): AxialCoord => {
  out[0] = a[0];
  out[1] = a[1];
  return out;
};

/**
 * Clone an axial coordinate.
 *
 * @param a - The axial coordinate to clone.
 * @returns A new axial coordinate.
 */
export const clone = (a: AxialCoord): AxialCoord => [a[0], a[1]];

/**
 * Round an axial coordinate to the nearest whole number.
 *
 * @param out - The receiving axial coordinate.
 * @param a - The source axial coordinate.
 * @returns The axial coordinate out.
 */
export const round = (out: AxialCoord, a: AxialCoord): AxialCoord => {
  const b = cubeCoord.fromAxial(cubeCoord.create(), a);
  cubeCoord.round(b, b);
  cubeCoord.toAxial(out, b);
  return out;
};

/**
 * Axial coordinate from a cube coordinate.
 *
 * @param out - The receiving axial coordinate.
 * @param a - The source cube coordinate.
 */
export const fromCube = (out: AxialCoord, a: CubeCoord): AxialCoord => {
  out[0] = a[0];
  out[1] = a[2];
  return out;
};

/**
 * Axial coordinate to a cube coordinate.
 *
 * @param out - The receiving cube coordinate.
 * @param a - The source axial coordinate.
 */
export const toCube = (out: CubeCoord, a: AxialCoord): CubeCoord => {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = -a[0] - a[1];
  return out;
};
