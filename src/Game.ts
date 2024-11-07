import { Hex } from './Hex/Hex';
import { drawFps } from './renderers/drawFps';
import { drawGrid } from './renderers/drawGrid';
import { drawMap } from './renderers/drawMap';

export type HexMap = Map<string, Hex>;

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

  // NOTE: this is for testing
  offsetX = 0;
  offsetY = 0;

  _hexes: HexMap = new Map();

  constructor(hexes: HexMap) {
    const size = 30;
    Hex.size = [size, size];

    this._hexes = hexes;

    const windowBBox = document.body.getBoundingClientRect();

    const canvas = document.createElement('canvas');
    canvas.width = windowBBox.width;
    canvas.height = windowBBox.height;
    canvas.style.position = 'fixed ';
    canvas.style.top = '0';
    canvas.style.left = '0';

    Hex.origin = [windowBBox.width / 2, windowBBox.height / 2];

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');

    this._canvas = canvas;
    this._ctx = ctx;

    document.body.appendChild(canvas);
  }

  selectHex(id: string) {
    if (id === this._selectedHex?.id) return;

    if (this._selectedHex) {
      this._selectedHex.deselect();
      this._selectedHex = null;
    }

    const hex = this._hexes.get(id);
    if (!hex) return;
    hex.select();
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
  }

  updateFps(elapsed: number) {
    this._actualFps = 1000 / elapsed;
    this._lastFpsUpdate += elapsed;

    if (this._lastFpsUpdate > this._fpsUpdateInterval) {
      this._lastFpsUpdate = 0;
      this._fps = this._actualFps;
    }
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

    if (this.drawGrid) drawGrid(ctx, this._canvas);
    drawMap(ctx, this._hexes);
    drawFps(ctx, this._fps);
  }
}
