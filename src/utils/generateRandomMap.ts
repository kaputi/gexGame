import { cube } from '../hexUtils';

interface HexMeta {
  coord: AxialCoord;
  terrain: string;
}

const terrains = ['grass', 'forest', 'river', 'ocean', 'desert', 'mountain', 'snow', 'tundra'];

export const generateRandomMap = (radius = 3): HexMeta[] => {
  const origin = cube.create();
  const range = cube.range(origin, radius);
  console.log('range', range);

  const mappedByR = new Map<number, CubeCoord[]>();
  range.forEach((cubeC) => {
    if (!mappedByR.has(cubeC[1])) mappedByR.set(cubeC[1], []);
    const sortedByS = mappedByR.get(cubeC[1])!;
    sortedByS.push(cubeC);
    sortedByS.sort((a, b) => a[2] - b[2]);
  });

  const keysSorted = Array.from(mappedByR.keys()).sort((a, b) => a - b);
  const flatCubesSorted: CubeCoord[] = [];
  keysSorted.forEach((key) => {
    flatCubesSorted.push(...mappedByR.get(key)!);
  });

  const AxialSorted = flatCubesSorted.map((cubeC) => {
    return cube.toAxial(cubeC);
  });

  const map = AxialSorted.map((coord) => {
    return {
      coord,
      terrain: terrains[Math.floor(Math.random() * terrains.length)],
    };
  });

  return map;
};
