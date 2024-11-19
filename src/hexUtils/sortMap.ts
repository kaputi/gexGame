import { Hex } from 'Hex';

export const sortMap = (hexes: Hex[]): Hex[] => {
  const mappedByR = new Map<number, Hex[]>();
  // create maps with hexes by r coord
  hexes.forEach((hex) => {
    if (!mappedByR.has(hex.cube[1])) mappedByR.set(hex.cube[1], []);
    mappedByR.get(hex.cube[1])!.push(hex);
  });

  // sort each r coord map by s coord
  mappedByR.forEach((hexes) => {
    hexes.sort((a, b) => a.cube[2] - b.cube[2]);
  });

  // create an array with sorted keys (keys are r coords)
  const keysSorted = Array.from(mappedByR.keys()).sort((a, b) => a - b);

  // create a flat array of hexes sorted by r and s coords
  const sorted: Hex[] = [];
  keysSorted.forEach((key) => {
    sorted.push(...mappedByR.get(key)!);
  });

  return sorted;
};
