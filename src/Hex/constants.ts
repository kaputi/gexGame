import { HexOrientation, HexDirection, NeighborType } from './types';

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
