export class LoadingScreen implements ScreenI {
  id = 'loading';

  spinnerRotation = 0;
  rotationSpeed = 0.005;

  count = 0;
  loaded = 0;

  draw(ctx: CanvasRenderingContext2D): void {
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;

    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText(`Loading: ${this.loaded} / ${this.count}`, 10, cy * 2 - 30);

    ctx.save();
    ctx.beginPath();
    ctx.translate(cx, cy);
    ctx.rotate(this.spinnerRotation);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    const radius = Math.min(cx * 0.1, 80);
    ctx.arc(0, 0, radius, 0, 1.6 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  update(deltaTime: number): void {
    this.spinnerRotation += this.rotationSpeed * deltaTime;
    if (this.spinnerRotation >= 360) this.spinnerRotation = 0;
  }
}
