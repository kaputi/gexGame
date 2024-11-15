import { Hex } from '../Hex';

const posittions = new Map<string, [number, number]>([
  ['ocean', [0, 1]],
  ['mountain', [1, 1]],
  ['forest', [2, 1]],
  ['snow', [3, 0]],
  ['river', [0, 0]],
  //[1,1] still no terrain
  ['desert', [1, 0]],
  ['grass', [2, 0]],
  ['tundra', [3, 1]],
]);

export const drawMap = (
  ctx: CanvasRenderingContext2D,
  map: Map<string, Hex>,
  tileImage: HTMLImageElement
) => {
  const resourceSize = [128, 128 + 3 * 20];
  // const ratio = resourceSize[0] / resourceSize[1];
  const ratio = resourceSize[1] / resourceSize[0];

  const { width, height } = Hex;

  for (const hex of map.values()) {
    const [tx, ty] = posittions.get(hex.terrain) || [0, 0];
    const [x, y] = hex.topLeft;
    ctx.drawImage(
      tileImage,
      tx * resourceSize[0],
      ty * resourceSize[1],
      resourceSize[0],
      resourceSize[1],
      x,
      y,
      width,
      height * ratio
    );
  }

  ctx.strokeStyle = '#ffffff';
  map.forEach((hex) => {
    const points = hex.points;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.stroke();
  });
};
