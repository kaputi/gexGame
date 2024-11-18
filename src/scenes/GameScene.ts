import { AssetManager } from '@core/assets';
import { Scene } from '@core/scenes';

export class GameScene implements Scene {
  id = 'game';

  assets = new AssetManager();

  update(deltaTime: number): void {
    if (deltaTime > 20) console.log('GameScene update');
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
