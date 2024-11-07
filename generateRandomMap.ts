import { AxialCoord, hexUtils } from './src/Hex';

interface HexMeta {
  coord: AxialCoord;
  terrain: string;
}

const terrains = ['grass', 'sea', 'mountain', 'forest', 'desert', 'swamp', 'snow'];

export const generateRandomMap = (radius = 3): HexMeta[] => {
  const origin = hexUtils.createCube();
  const range = hexUtils.range(origin, radius);

  const arrOfArrs: AxialCoord[][] = [];

  range.forEach((cubeC) => {
    const axial = hexUtils.toAxial(hexUtils.createAxial(), cubeC);
    if (!arrOfArrs[axial[1]]) arrOfArrs[axial[1]] = [];
    arrOfArrs[axial[1]].push(axial);
  });

  const flatArr = arrOfArrs.flat();

  const map = flatArr.map((coord) => {
    return {
      coord,
      terrain: terrains[Math.floor(Math.random() * terrains.length)],
    };
  });

  return map;
};
