import { HexMap } from '../Game';

export const drawMap = (ctx: CanvasRenderingContext2D, map: HexMap) => {
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
    if (hex.selected) {
      ctx.fillStyle = '#ff0000';
      ctx.fill();
    }
  });
};
