import { Hex } from '../hex';

export const drawMap = (
  ctx: CanvasRenderingContext2D,
  map: Map<string, Hex>,
  offsetX: number,
  offsetY: number
) => {
  ctx.strokeStyle = '#ffffff';
  map.forEach((hex) => {
    const points = hex.points;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0] + offsetX, p[1] + offsetY);
      else ctx.lineTo(p[0] + offsetX, p[1] + offsetY);
    });
    ctx.closePath();
    ctx.stroke();
    if (hex.selected) {
      ctx.fillStyle = '#ff0000';
      ctx.fill();
    }
  });
};
