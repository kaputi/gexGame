export const drawLoading = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spinnerRotation: number,
  progress: [number, number]
) => {
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';
  ctx.fillText(`Loading: ${progress[0]} / ${progress[1]}`, 10, cy * 2 - 30);

  // spinner
  ctx.save();
  ctx.beginPath();
  ctx.translate(cx, cy);
  ctx.rotate(spinnerRotation);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 15;
  ctx.lineCap = 'round';
  const radius = Math.min(cx * 0.1, 80);
  ctx.arc(0, 0, radius, 0, 1.6 * Math.PI);
  ctx.stroke();
  ctx.restore();
};
