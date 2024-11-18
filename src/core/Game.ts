import { FPS } from '@core/FPS';
import { SceneManager } from '@core/SceneManager';

export class Game {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  private _width = 800;
  private _height = 600;
  private _previousTime = -1;
  private _backgroundColor = '#000000';

  private _FPS = new FPS();

  scenes = new SceneManager();
  constructor() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.zIndex = '-1';

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2d context');

    this._canvas = canvas;
    this._ctx = ctx;

    document.body.appendChild(canvas);
    this.handleResize(); // set initial size

    window.addEventListener('resize', this.handleResize.bind(this));

    requestAnimationFrame(this.loop.bind(this));
  }

  set backgroundColor(color: string) {
    if (!/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(color)) throw new Error('Invalid color');
    this._backgroundColor = color;
  }

  get backgroundColor(): string {
    return this._backgroundColor;
  }

  private handleResize(): void {
    // TODO: move this to state
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._canvas.width = this._width;
    this._canvas.height = this._height;
  }

  /**
   * Update the game state
   *
   * @param deltaTime The time in ms since last draw
   */
  private update(deltaTime: number): void {
    this._FPS.update(deltaTime);
    this.scenes.update(deltaTime);
  }

  private draw(): void {
    const ctx = this._ctx;

    // clear the canvas
    ctx.fillStyle = this._backgroundColor;
    ctx.fillRect(0, 0, this._width, this._height);

    this.scenes.draw(ctx);

    // fps is always on top and is not a scene
    this._FPS.draw(ctx);
  }

  private loop(elapsed: number): void {
    if (this._previousTime <= 0) this._previousTime = elapsed;

    this.update(elapsed - this._previousTime);
    this.draw();

    this._previousTime = elapsed;

    requestAnimationFrame(this.loop.bind(this));
  }
}
