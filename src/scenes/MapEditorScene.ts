import { AssetManager } from '@core/assets';
import { Scene } from '@core/scenes';

export class MapEditorScene implements Scene {
  id = 'mapEditor ';
  assets = new AssetManager();

  // constructor(assetsToLoad: [string, string][]) {
  // assetsToLoad.forEach(([name, src]) => this.assets.addImage(name, src));
  // }

  update() {
    console.log('Updating map editor scene');
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx.canvas.width === 0 || ctx.canvas.height === 0) return;
    console.log('Drawing map editor scene');
  }
}
