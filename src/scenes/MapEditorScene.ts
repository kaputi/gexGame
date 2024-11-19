import { AssetManager } from '@core/assets';
import { Scene, SceneManager } from '@core/scenes';
import { TileSheet } from '@core/TileSheet';
import { Hex } from 'Hex';
import { cube, sortMap } from 'hexUtils';
import { drawHexGrid } from 'renderers/drawHexGrid';
import { drawMap } from 'renderers/drawMap';

const assetsToLoad: [string, string][] = [['hexTiles', 'g32.png']];

export class MapEditorScene implements Scene {
  assets = new AssetManager();
  manager?: SceneManager;

  setTerrain: Terrain = 'grass';

  private gridHexes = new Map<string, Hex>();
  private mapHexes = new Map<string, Hex>();

  public mapTileSheet: TileSheet | null = null;

  constructor(public id: string) {
    const range = cube.range(cube.create(), 25);
    range.forEach(([q, r, s]) => {
      const hex = new Hex(q, r, s);
      this.gridHexes.set(hex.id, hex);
    });

    assetsToLoad.forEach(([id, src]) => {
      this.assets.add(id, src);
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawHexGrid(ctx, Array.from(this.gridHexes.values()));

    if (this.mapTileSheet) {
      drawMap(ctx, this.mapHexes, this.mapTileSheet);
    }
  }

  handleMouseUp(e: MouseEvent) {
    const coord = Hex.pointToHex([e.clientX, e.clientY]);
    const id = cube.toString(coord);
    if (this.mapHexes.has(id)) {
      this.mapHexes.get(id)!.terrain = this.setTerrain;
    } else {
      const hex = new Hex(coord[0], coord[1], coord[2]);
      hex.terrain = this.setTerrain;
      this.addHexToMap(hex);
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Enter':
        if (this.manager) this.manager.activate('editorPauseMenu');
        break;
    }
  }

  addHexToMap(hex: Hex) {
    this.mapHexes.set(hex.id, hex);
    const mapArr = Array.from(this.mapHexes.values());
    const sorted = sortMap(mapArr);
    this.mapHexes = new Map(sorted.map((hex) => [hex.id, hex]));
  }
}
