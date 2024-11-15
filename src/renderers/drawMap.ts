import { Hex } from '../Hex';
import { TileSet } from '../TileSet';

const posittions = new Map<string, [number, number]>([
  ['ocean', [0, 1]],
  ['mountain', [1, 1]],
  ['grass', [2, 1]],
  ['snow', [3, 0]],
  ['river', [0, 0]],
  //[1,1] still no terrain
  ['desert', [1, 0]],
  ['forest', [2, 0]],
  ['tundra', [3, 1]],
]);

export const drawMap = (ctx: CanvasRenderingContext2D, map: Map<string, Hex>, tileSet: TileSet) => {
  const { width, height } = Hex;

  const tileImage = tileSet.getImage();
  const { tileWidth, tileHeight, ratio } = tileSet;

  for (const hex of map.values()) {
    if (hex.terrain === '') continue;
    const [tx, ty] = posittions.get(hex.terrain) || [0, 0];
    const [x, y] = hex.topLeft;
    ctx.drawImage(
      tileImage,
      tx * tileWidth,
      ty * tileHeight,
      tileWidth,
      tileHeight,
      x,
      y,
      width,
      height * ratio
    );
  }

  // ctx.strokeStyle = '#ffffff';
  // map.forEach((hex) => {
  //   const points = hex.points;
  //   ctx.beginPath();
  //   points.forEach((p, i) => {
  //     if (i === 0) ctx.moveTo(p[0], p[1]);
  //     else ctx.lineTo(p[0], p[1]);
  //   });
  //   ctx.closePath();
  //   ctx.stroke();
  // });
};
