import { TileAsset } from '../Assets/TileAsset';
import { Hex } from '../Hex';
import { sqrt3 } from '../utils/math';

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
  tileAsset: TileAsset
) => {
  const image = tileAsset.data as HTMLImageElement;
  const resourceSize = tileAsset.resourceSize!;
  const tileSize = tileAsset.tileSize!;
  const offset = tileAsset.offset!;

  const hexWidth = sqrt3 * Hex.size[0];
  const hexHeight = Hex.size[1] * 2;

  for (const hex of map.values()) {
    const [tx, ty] = posittions.get(hex.terrain) || [0, 0];
    const [x, y] = hex.topLeft;
    ctx.drawImage(
      image,
      tx * resourceSize[0],
      ty * resourceSize[1],
      resourceSize[0],
      resourceSize[1],
      x,
      y,
      hexWidth,
      hexHeight + (offset[1] * hexHeight) / tileSize[1]
    );
  }

  ctx.strokeStyle = '#ffffff';
  map.forEach((hex) => {
    const points = hex.points;
    ctx.beginPath();
    ctx.lineWidth = 10;
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    // ctx.stroke();
    if (hex.selected) {
      ctx.strokeStyle = '#ff0000';
      ctx.stroke();
      // ctx.fillStyle = '#ff0000';
      // ctx.fill();
    }
  });
};
