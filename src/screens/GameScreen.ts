import { AssetManager } from '@core/assets';

export class GameScreen implements ScreenI {
  id = 'game';

  assets = new AssetManager();

  update(deltaTime: number): void {
    if (deltaTime > 20) console.log('GameScreen update');
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
