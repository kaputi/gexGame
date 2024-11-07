export const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const { width, height } = canvas;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  ctx.fillStyle = '#00ff00';
  for (let i = 0; i < halfWidth; i += 10) {
    if (i !== 0 && i % 100 === 0) ctx.strokeStyle = '#00ff00';
    else ctx.strokeStyle = '#00661b';
    ctx.beginPath();

    ctx.moveTo(halfWidth + i, 0);
    ctx.lineTo(halfWidth + i, height);
    ctx.moveTo(halfWidth - i, 0);
    ctx.lineTo(halfWidth - i, height);

    ctx.stroke();

    if (i !== 0 && i % 100 === 0) {
      ctx.fillText(i.toString(), halfWidth + i, 30);
      ctx.fillText(`- ${i.toString()}`, halfWidth - i, 30);
    }
  }

  for (let i = 0; i < halfHeight; i += 10) {
    if (i !== 0 && i % 100 === 0) ctx.strokeStyle = '#00ff00';
    else ctx.strokeStyle = '#00661b';

    ctx.beginPath();
    ctx.moveTo(0, halfHeight + i);
    ctx.lineTo(width, halfHeight + i);
    ctx.moveTo(0, halfHeight - i);
    ctx.lineTo(width, halfHeight - i);

    ctx.stroke();

    if (i !== 0 && i % 100 === 0) {
      ctx.fillText(i.toString(), 30, halfHeight + i);
      ctx.fillText('-' + i.toString(), 30, halfHeight - i);
    }
  }

  ctx.strokeStyle = '#ff0000';
  ctx.beginPath();
  ctx.moveTo(halfWidth, 0);
  ctx.lineTo(halfWidth, height);
  ctx.moveTo(0, halfHeight);
  ctx.lineTo(width, halfHeight);
  ctx.stroke();
};
