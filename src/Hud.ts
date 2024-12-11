import { game } from '@core/Game';

interface ButtonTest {
  text: string;
  action(): void;
  width: number;
  height: number;
  x: number;
  y: number;
}

export class Hud {
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  backgroundColor = '#ffffff';
  alpha = 0.5;

  fontHeight = 20;
  vPadding = 5;
  hPadding = 10;

  buttons: ButtonTest[] = [];

  addButton(text: string, action: () => void) {
    const width = game.ctx.measureText(text).width + this.hPadding;
    const height = this.fontHeight + this.vPadding;
    const x = this.x + this.width / 2 - width / 2;
    const y = 20 + this.y + (height + 10) * this.buttons.length - 1;
    const btn = { text, action, width, height, x, y };
    this.buttons.push(btn);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.backgroundColor;
    ctx.globalAlpha = this.alpha;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.globalAlpha = 1;

    ctx.font = `${this.fontHeight}px Arial`; // font size is equal to height of font

    ctx.textBaseline = 'top';
    this.buttons.forEach(({ text, x, y }) => {
      const textWidth = ctx.measureText(text).width;

      ctx.fillStyle = '#000000';
      ctx.fillRect(
        x - this.hPadding / 2,
        y - this.vPadding / 2,
        textWidth + this.hPadding,
        this.fontHeight + this.vPadding
      );

      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, x, y);
    });

    ctx.textBaseline = 'alphabetic';
  }

  handleMouseUp(e: MouseEvent): boolean {
    const { clientX: x, clientY: y } = e;
    if (x <= this.x || x >= this.x + this.width || y <= this.y || y >= this.y + this.height)
      return false;

    // get the actual button
    this.buttons.forEach((btn) => {
      if (x >= btn.x && x <= btn.x + btn.width && y >= btn.y && y <= btn.y + btn.height) {
        btn.action();
      }
    });

    return true;
  }
}
