import { AssetManager } from '@core/assets';
import { Scene } from '@core/scenes';

export class GameScene implements Scene {
  assets = new AssetManager();

  constructor(public id: string) {}

  update(deltaTime: number): void {
    if (deltaTime > 20) console.log('GameScene update');
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
