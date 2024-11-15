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

export const pointySides: DirectionMap = new Map([
  [NORTH_EAST, [1, -1, 0]],
  [EAST, [1, 0, -1]],
  [SOUTH_EAST, [0, 1, -1]],
  [SOUTH_WEST, [-1, 1, 0]],
  [WEST, [-1, 0, 1]],
  [NORTH_WEST, [0, -1, 1]],
]);
export const pointyDiagonals: DirectionMap = new Map([
  [NORTH, [1, -2, 1]],
  [NORTH_EAST, [2, -1, -1]],
  [EAST, [1, 1, -2]],
  [SOUTH, [-1, 2, -1]],
  [SOUTH_WEST, [-2, 1, 1]],
  [NORTH_WEST, [-1, -1, 2]],
]);
export const flatSides: DirectionMap = new Map([
  [NORTH, [0, -1, 1]],
  [NORTH_EAST, [1, -1, 0]],
  [SOUTH_EAST, [1, 0, -1]],
  [SOUTH, [0, 1, -1]],
  [SOUTH_WEST, [-1, 1, 0]],
  [NORTH_WEST, [-1, 0, 1]],
]);
export const flatDiagonals: DirectionMap = new Map([
  [NORTH_EAST, [1, -2, 1]],
  [EAST, [2, -1, -1]],
  [SOUTH_EAST, [1, 1, -2]],
  [SOUTH_WEST, [-1, 2, -1]],
  [WEST, [-2, 1, 1]],
  [NORTH_WEST, [-1, -1, 2]],
]);

export const cubeEpsilon: CubeCoord = [1e-6, 2e-6, -3e-6];
