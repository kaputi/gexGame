interface IndexedCollection extends Iterable<number> {
  readonly length: number;
  [index: number]: number;
}

declare type AxialCoord = [number, number] | IndexedCollection;
declare type CubeCoord = [number, number, number] | IndexedCollection;

declare type HexOrientation = 'pointy' | 'flat';
declare type NeighborType = 'side' | 'diagonal';
declare type HexDirection =
  | 'NORTH'
  | 'NORTH_EAST'
  | 'EAST'
  | 'SOUTH_EAST'
  | 'SOUTH'
  | 'SOUTH_WEST'
  | 'WEST'
  | 'NORTH_WEST';
declare type DirectionMap = Map<HexDirection, CubeCoord>;

declare type Terrain =
  | 'grass'
  | 'forest'
  | 'river'
  | 'ocean'
  | 'desert'
  | 'mountain'
  | 'snow'
  | 'tundra';
