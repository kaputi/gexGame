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
  tiles: HTMLImageElement
) => {
  for (const [_, hex] of map) {
    const [tx, ty] = posittions.get(hex.terrain) || [0, 0];

    const [x, y] = hex.topLeft;

    const mod = 13 * (-3 + hex.cube[1]);
    // if (hex.cube[1] === -3) {
    //   mod = 0;
    // }

    ctx.drawImage(
      tiles, // srcImage
      tx * 128, // scrX
      ty * 148, // src Y
      128, // src width
      148, // src height
      x, // dstX
      y, // dsty
      sqrt3 * Hex.size[0], // destWidth
      Hex.size[1] * 2 + 20 // destHeight // TODO: add tile heights
    );
  }

  // ctx.strokeStyle = 'red';
  // map.forEach((hex) => {
  //   const points = hex.points;
  //   ctx.beginPath();
  //   ctx.lineWidth = 2;
  //   points.forEach((p, i) => {
  //     if (i === 0) ctx.moveTo(p[0], p[1]);
  //     else ctx.lineTo(p[0], p[1]);
  //   });
  //   ctx.closePath();
  //   ctx.stroke();
  //   // if (hex.selected) {
  //   //   ctx.fillStyle = '#ff0000';
  //   //   ctx.fill();
  //   // }
  // });
};
