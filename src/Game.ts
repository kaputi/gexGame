import { ASSET_TYPE_IMAGE, ImageAsset } from './Assets';
import { Assets } from './Assets/Assets';
import { Hex } from './Hex/Hex';
import { cube } from './hexUtils';
import { drawFps } from './renderers/drawFps';
import { drawGrid } from './renderers/drawGrid';
import { drawLoading } from './renderers/drawLoading';
import { drawMap } from './renderers/drawMap';
import { drawSelecetdHex } from './renderers/drawSelectedHex';
import { TileSet } from './TileSet';
import { WorldMap } from './WorldMap';

export class Game {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _running = false;
  private _loopId: number | null = null;

  private _backgroundColor = '#000000';

  private _previous = -1;

  private _actualFps = 0;
  private _fps = -1;
  private _lastFpsUpdate = 0;
  private _fpsUpdateInterval = 300;

  // TODO: this should be state
  private _selectedHex: Hex | null = null;

  private drawGrid = true;
  private loadingScreen = true;
  private spinnerRotation = 0;
  private cx = 0;
  private cy = 0;

  assets = new Assets();
  tileSets = new Map<string, TileSet>();
  worldMap: WorldMap | null = null;

  testTerrain: Terrain = 'grass';

  private mouseDown = false;
  private firstClick: [number, number] | null = null;
  private mouseMoved = false;

  constructor() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed ';
    canvas.style.top = '0';
    canvas.style.left = '0';

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');
    this._canvas = canvas;
    this._ctx = ctx;

    document.body.appendChild(canvas);

    window.addEventListener('resize', this.handleResize.bind(this));

    this._canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));

    this._canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    this._canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));

    this._canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));

    this.handleResize();
  }

  handleMouseWheel(e: WheelEvent) {
    const mousePos = [e.clientX, e.clientY];

    const hex = Hex.pointToHex(mousePos, false);

    const modifier = e.deltaY > 0 ? 0.9 : 1.1;
    const newWidth = Hex.width * modifier;
    const newHeight = Hex.height * modifier;
    Hex.setDimensions(newWidth, newHeight);
    const newOrigin = [...Hex.origin].map((v) => v * modifier);
    Hex.origin = newOrigin;

    const newPoint = Hex.hexToPoint(hex);

    const diff = [newPoint[0] - mousePos[0], newPoint[1] - mousePos[1]];
    Hex.origin = [Hex.origin[0] - diff[0], Hex.origin[1] - diff[1]];
  }

  handleMouseDown(e: MouseEvent) {
    this.mouseDown = true;
    this.firstClick = [e.clientX, e.clientY];
  }

  handleMouseMove(e: MouseEvent) {
    const hex = Hex.pointToHex([e.clientX, e.clientY]);
    this.selectHex(cube.toString(hex));
    if (!this.mouseDown || !this.firstClick) return;
    const dist = [e.clientX - this.firstClick[0], e.clientY - this.firstClick[1]];
    if (Math.sqrt(dist[0] ** 2 + dist[1] ** 2) < 2) return;
    this.mouseMoved = true;
    Hex.origin[0] += e.movementX;
    Hex.origin[1] += e.movementY;
  }

  handleMouseUp(e: MouseEvent) {
    if (!this.mouseMoved) {
      // TODO:  this code is for map editor
      if (!this.worldMap) return;
      const hexCoord = Hex.pointToHex([e.x, e.y]);
      const id = cube.toString(hexCoord);

      if (!this.worldMap.hexes.has(id)) {
        const hex = new Hex(hexCoord[0], hexCoord[1], hexCoord[2]);
        hex.terrain = this.testTerrain;
        this.worldMap.addMapHex(hex);
      } else this.worldMap.removeMapHex(this.worldMap.hexes.get(id)!);
      // console.log(JSON.stringify(this.worldMap.getMapMetadata()));
    }
    this.mouseDown = false;
    this.mouseMoved = false;
  }

  handleResize() {
    const windowBBox = document.body.getBoundingClientRect();
    this._canvas.width = windowBBox.width;
    this._canvas.height = windowBBox.height;
    this.cx = windowBBox.width / 2;
    this.cy = windowBBox.height / 2;
    Hex.origin = [this.cx, this.cy];
  }

  setTileSet(name: string, assetName: string, tileWidth: number, tileHeight: number) {
    const assetObj = this.assets.get(assetName);
    if (!assetObj) throw new Error('Asset not found');
    const { asset } = assetObj;
    if (asset.type !== ASSET_TYPE_IMAGE) throw new Error('Invalid asset type');
    this.tileSets.set(name, new TileSet(name, asset as ImageAsset, tileWidth, tileHeight));
  }

  selectHex(id: string) {
    if (!this.worldMap || id === this._selectedHex?.id) return;

    if (this._selectedHex) {
      this._selectedHex = null;
    }

    const hex = this.worldMap.hexes.get(id);
    if (!hex) return;
    this._selectedHex = hex;
  }

  set backgroundColor(color: string) {
    if (!/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) throw new Error('Invalid color');
    this._backgroundColor = color;
  }

  get backgroundColor() {
    return this._backgroundColor;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._loopId = requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    if (!this._running) return;
    this._running = false;
    cancelAnimationFrame(this._loopId!);
    this._loopId = null;
  }

  update(elapsed: number) {
    // TODO: update game state

    // NOTE: elapsed is in ms
    // so for example gravity, should be how many pixels to fall per ms

    this.updateFps(elapsed);
    if (this.loadingScreen) this.updateLoading(elapsed);
  }

  updateFps(elapsed: number) {
    this._actualFps = 1000 / elapsed;
    this._lastFpsUpdate += elapsed;

    if (this._lastFpsUpdate > this._fpsUpdateInterval) {
      this._lastFpsUpdate = 0;
      this._fps = this._actualFps;
    }
  }

  updateLoading(elapsed: number) {
    this.spinnerRotation += 0.005 * elapsed; // spinner speed  * elapsed
    if (this.spinnerRotation > 360) this.spinnerRotation = 0;

    if (this.assets.progress[0] === this.assets.progress[1] && this.worldMap)
      this.loadingScreen = false;
  }

  loop(timestamp: number) {
    if (this._previous === -1) this._previous = timestamp;

    this.update(timestamp - this._previous);

    this.draw();

    this._previous = timestamp;

    this._loopId = requestAnimationFrame(this.loop.bind(this));
  }

  draw() {
    const ctx = this._ctx;

    // clear the canvas
    ctx.fillStyle = this._backgroundColor;
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    if (this.loadingScreen) {
      drawLoading(ctx, this.cx, this.cy, this.spinnerRotation, this.assets.progress);
      return;
    }

    if (this.drawGrid) drawGrid(ctx, this._canvas);
    if (this.worldMap)
      drawMap(
        ctx,
        this.worldMap.hexes,
        // this.assets.get('hexTiles')!.asset.data as HTMLImageElement
        // this.assets.get('mapTilesHeight3')!.asset.data as HTMLImageElement
        this.tileSets.get('mapTiles')!
      );
    if (this._selectedHex) drawSelecetdHex(ctx, this._selectedHex);

    drawFps(ctx, this._fps);
  }
}
