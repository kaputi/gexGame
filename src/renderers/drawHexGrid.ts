import { Hex } from 'Hex';

export const drawHexGrid = (ctx: CanvasRenderingContext2D, hexes: Hex[]): void => {
  ctx.strokeStyle = '#ffffff';
  hexes.forEach((hex) => {
    const points = hex.points;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.closePath();
    ctx.stroke();

    // NOTE: only for debugging
    // ctx.fillStyle = '#ffffff';
    // ctx.font = '12px Arial';
    // ctx.textAlign = 'center';
    // ctx.fillText(hex.terrain, hex.center[0], hex.center[1]);
  });
};
