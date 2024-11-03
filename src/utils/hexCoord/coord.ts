import { sqrt3 } from '../math';
import {
  EAST,
  NORTH,
  NORTH_EAST,
  NORTH_WEST,
  POINTY_TOP,
  SOUTH,
  SOUTH_EAST,
  SOUTH_WEST,
  WEST,
} from './constants';
import { CubeCoord, DirectionMap, HexOrientation } from './types';

export abstract class Coords {
  static readonly pointySides: DirectionMap = new Map([
    [NORTH_EAST, [1, -1, 0]],
    [EAST, [1, 0, -1]],
    [SOUTH_EAST, [0, 1, -1]],
    [SOUTH_WEST, [-1, 1, 0]],
    [WEST, [-1, 0, 1]],
    [NORTH_WEST, [0, -1, 1]],
  ]);
  static readonly pointyDiagonals: DirectionMap = new Map([
    [NORTH, [1, -2, 1]],
    [NORTH_EAST, [2, -1, -1]],
    [EAST, [1, 1, -2]],
    [SOUTH, [-1, 2, -1]],
    [SOUTH_WEST, [-2, 1, 1]],
    [NORTH_WEST, [-1, -1, 2]],
  ]);
  static readonly flatSides: DirectionMap = new Map([
    [NORTH, [0, -1, 1]],
    [NORTH_EAST, [1, -1, 0]],
    [SOUTH_EAST, [1, 0, -1]],
    [SOUTH, [0, 1, -1]],
    [SOUTH_WEST, [-1, 1, 0]],
    [NORTH_WEST, [-1, 0, 1]],
  ]);
  static readonly flatDiagonals: DirectionMap = new Map([
    [NORTH_EAST, [1, -2, 1]],
    [EAST, [2, -1, -1]],
    [SOUTH_EAST, [1, 1, -2]],
    [SOUTH_WEST, [-1, 2, -1]],
    [WEST, [-2, 1, 1]],
    [NORTH_WEST, [-1, -1, 2]],
  ]);
  static readonly cubeEpsilon: CubeCoord = [1e-6, 2e-6, -3e-6];

  protected static _width = 0;
  protected static _height = 0;
  private static _orientation: HexOrientation = POINTY_TOP;
  private static _size = -1;

  private static updateDimensions() {
    Coords._width = Coords._orientation === 'pointy' ? Coords._size * sqrt3 : Coords._size * 2;
    Coords._height = Coords._orientation === 'pointy' ? Coords._size * 2 : Coords._size * sqrt3;
  }

  static get size() {
    if (Coords._size === -1) throw new Error('Coords.size must be set');
    return Coords._size;
  }

  static set size(value: number) {
    if (value === Coords._size) return;
    Coords._size = value;
    Coords.updateDimensions();
  }

  static get orientation() {
    return Coords._orientation;
  }

  static set orientation(value: HexOrientation) {
    if (value === Coords._orientation) return;
    Coords._orientation = value;
    Coords.updateDimensions();
  }
}
