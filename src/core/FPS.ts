export class FPS {
  private _actualFps = 0;
  private _fps = -1;
  private _prevTime = -1;
  private _updateInterval = 300;

  update(deltaTime: number): void {
    this._actualFps = 1000 / deltaTime;
    if (this._prevTime <= 0) this._prevTime = deltaTime;

    if (this._prevTime >= this._updateInterval) {
      this._prevTime = this._prevTime % this._updateInterval;
      this._fps = this._actualFps;
    }

    this._prevTime += deltaTime;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this._fps <= 0) return;
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`FPS: ${Math.floor(this._fps)}`, 10, 30);
  }
}
