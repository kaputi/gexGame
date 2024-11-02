import { Hex } from './hex';
import { Vec3 } from './utils/coord';

export type HexMap = Map<string, Vec3>;

export class Game {
  private _map = new Map<string, Vec3>();
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _running = false;
  private _loopId: number | null = null;

  private _lastDrawTime = -1;
  private _fps = -1;
  private _lastFpsDrawTime = -1;

  private selectedHex: string | null = null;

  offsetX = 0;
  offsetY = 0;

  _backgroundColor = '#000000';

  _hexes: Hex[] = [];

  constructor(map: HexMap) {
    this._map = map;
    const size = 30;
    Hex.size = size;

    this._map.forEach((v) => {
      this._hexes.push(new Hex(v));
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
    if (this._map.has(id)) {
      // console.log(id);
    }
    this.selectedHex = id;
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
    this.loop();
  }

  stop() {
    if (!this._running) return;
    this._running = false;
    cancelAnimationFrame(this._loopId!);
    this._loopId = null;
  }

  loop() {
    // TODO:
    // only draw if something changed
    this.draw();
    if (this._lastDrawTime === -1) {
      this._lastDrawTime = performance.now();
      this._lastFpsDrawTime = this._lastDrawTime;
    } else {
      const now = performance.now();
      if (now - this._lastFpsDrawTime > 500) {
        this._fps = 1000 / (now - this._lastDrawTime);
        this._lastFpsDrawTime = now;
      }
      this._lastDrawTime = now;
    }

    this._loopId = requestAnimationFrame(this.loop.bind(this));
  }

  drawFps() {
    const ctx = this._ctx;
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`FPS: ${Math.round(this._fps)}`, 10, 20);
  }

  drawHexes() {
    const ctx = this._ctx;
    ctx.strokeStyle = '#ffffff';
    this._hexes.forEach((hex) => {
      const points = hex.points;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p[0] + this.offsetX, p[1] + this.offsetY);
        else ctx.lineTo(p[0] + this.offsetX, p[1] + this.offsetY);
      });
      ctx.closePath();
      ctx.stroke();
      if (this.selectedHex === hex.id) {
        ctx.fillStyle = '#ff0000';
        ctx.fill();
      }
    });
  }

  draw() {
    const ctx = this._ctx;
    ctx.fillStyle = this._backgroundColor;
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawHexes();

    this.drawFps();
  }
}
