export const drawFps = (ctx: CanvasRenderingContext2D, fps: number) => {
  if (fps === -1) return;
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';
  ctx.fillText(`FPS: ${Math.floor(fps)}`, 10, 30);
};
