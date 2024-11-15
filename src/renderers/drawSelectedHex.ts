import { Hex } from '../Hex';

export const drawSelecetdHex = (ctx: CanvasRenderingContext2D, hex: Hex) => {
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 10;
  ctx.beginPath();
  const points = hex.points;
  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(points[i][0], points[i][1]);
    else ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
};
