export type CubeCoord = [number, number, number];
export type AxialCoord = [number, number];
export type HexOrientation = 'pointy' | 'flat';
export type NeighborType = 'side' | 'diagonal';
export type HexDirection =
  | 'NORTH'
  | 'NORTH_EAST'
  | 'EAST'
  | 'SOUTH_EAST'
  | 'SOUTH'
  | 'SOUTH_WEST'
  | 'WEST'
  | 'NORTH_WEST';
export type DirectionMap = Map<HexDirection, CubeCoord>;
