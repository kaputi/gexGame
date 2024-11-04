import { Hex } from './hex';
import { drawFps } from './renderers/drawFps';
import { drawMap } from './renderers/drawMap';
import { Coords, cubeCoord, CubeCoord } from './utils/hexCoord';

export type HexMap = Map<string, CubeCoord>;

export class Game {
  private _map = new Map<string, CubeCoord>();
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _running = false;
  private _loopId: number | null = null;

  private _backgroundColor = '#000000';

  private _previous = -1;
  private _fps = -1;

  // TODO: this should be state
  private _selectedHex: Hex | null = null;

  // NOTE: this is for testing
  offsetX = 0;
  offsetY = 0;

  // _hexes: Hex[] = [];
  _hexes = new Map<string, Hex>();

  constructor(map: HexMap) {
    this._map = map;
    const size = 30;
    Coords.size = size;

    this._map.forEach((v) => {
      this._hexes.set(cubeCoord.toString(v), new Hex(v));
    });

    const windowBBox = document.body.getBoundingClientRect();

    const canvas = document.createElement('canvas');
    canvas.width = windowBBox.width;
    canvas.height = windowBBox.height;
    canvas.style.position = 'fixed ';
    canvas.style.top = '0';
    canvas.style.left = '0';

    this.offsetX = windowBBox.width / 2;
    this.offsetY = windowBBox.height / 2;

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

    // NOTE: elapsed is in ms or s (see loop)
    // so for example gravity, should be how many pixels to fall per second or per ms

    console.log(elapsed);
  }

  loop(timestamp: number) {
    if (this._previous === -1) this._previous = timestamp;

    // NOTE: elapsed time is in milliseconds, but maybe we should use seconds
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

    drawMap(ctx, this._hexes, this.offsetX, this.offsetY);
    drawFps(ctx, this._fps);
  }
}
