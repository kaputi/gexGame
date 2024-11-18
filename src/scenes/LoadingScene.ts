import { AssetManager } from '@core/assets';
import { Scene } from '@core/scenes';

export class LoadingScene implements Scene {
  private _spinnerRotation = 0;
  private _rotationSpeed = 0.005;

  assetManagerToLoad: AssetManager | null = null;

  constructor(public id: string) {}

  draw(ctx: CanvasRenderingContext2D): void {
    const cx = ctx.canvas.width / 2;
    const cy = ctx.canvas.height / 2;

    if (this.assetManagerToLoad) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Arial';
      const [loaded, count] = this.assetManagerToLoad.progress;
      ctx.fillText(`Loading: ${loaded} / ${count}`, 10, cy * 2 - 30);
    }

    ctx.save();
    ctx.beginPath();
    ctx.translate(cx, cy);
    ctx.rotate(this._spinnerRotation);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    const radius = Math.min(cx * 0.1, 80);
    ctx.arc(0, 0, radius, 0, 1.6 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  update(deltaTime: number): void {
    this._spinnerRotation += this._rotationSpeed * deltaTime;
    if (this._spinnerRotation >= 360) this._spinnerRotation = 0;
  }
}
