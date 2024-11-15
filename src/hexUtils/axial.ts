/**
 * Axial hexagon coordinate utilities
 *
 * @module axial
 */

/**
 * Create a new axial coordinate
 *
 * @returns {AxialCoord} A new axial coordinate
 */
export const create = (): AxialCoord => new Float32Array(2);

/**
 * Checks if two axial coordinates are equal
 *
 * @param {AxialCoord} a - The first axial coordinate
 * @param {AxialCoord} b - The second axial coordinate
 * @returns {boolean} True if the coordinates are equal, false otherwise
 */
export const equal = (a: AxialCoord, b: AxialCoord): boolean => a[0] === b[0] && a[1] === b[1];
/** Alias for equal */
export const eq = equal;
