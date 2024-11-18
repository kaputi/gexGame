import { Scene } from '@core/scenes';
import { validateHexColor } from 'utils/validateHexColor';

export interface MenuItem {
  text: string;
  help?: string;
  action: () => unknown;
}

export interface Menu {
  selected: number;
  title?: string;
  items: MenuItem[];
}

export class MenuScene implements Scene {
  private menus = new Map<string, Menu>();
  private activeMenu = '';

  private _background: string | null = '#000000';
  private _backgroundAlpha = 0.5;

  public itemHeight = 30;

  set background(color: string | null) {
    if (color === null) {
      this._background = null;
      return;
    }
    if (!validateHexColor(color)) throw new Error('Invalid color');
    this._background = color;
  }

  get background(): string | null {
    return this._background;
  }

  set backgroundAlpha(alpha: number) {
    this._backgroundAlpha = Math.min(1, Math.max(0, alpha));
  }

  get backgroundAlpha(): number {
    return this._backgroundAlpha;
  }

  constructor(public id: string) {}

  public addMenu(id: string, menuItems: MenuItem[], title?: string) {
    this.menus.set(id, { selected: 0, items: menuItems, title });
    if (this.activeMenu === '') this.activeMenu = id;
  }

  public activateMenu(id: string) {
    if (!this.menus.has(id)) return;
    this.activeMenu = id;
  }

  public handleKeyDown(e: KeyboardEvent) {
    const menu = this.menus.get(this.activeMenu);
    if (!menu) return;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        menu.selected = Math.max(0, menu.selected - 1);
        break;
      case 'ArrowDown':
      case 's':
        menu.selected = Math.min(menu.items.length - 1, menu.selected + 1);
        break;
      case 'Enter':
        menu.items[menu.selected].action();
        break;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.menus.has(this.activeMenu)) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';

    if (this._background) {
      ctx.globalAlpha = this._backgroundAlpha;
      ctx.fillStyle = this._background;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }

    const { items, selected, title } = this.menus.get(this.activeMenu)!;

    let start = height / 2 - (items.length * this.itemHeight) / 2;

    if (title) {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(title, width / 2, start);
      start += this.itemHeight * 2;
    }

    for (let i = 0; i < items.length; i++) {
      const y = start + i * this.itemHeight;
      if (i === selected) {
        const textSize = ctx.measureText(items[i].text);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width / 2 - textSize.width / 2, y - 24, textSize.width, 30);
        ctx.fillStyle = '#000000';
      } else ctx.fillStyle = '#ffffff';

      ctx.fillText(items[i].text, width / 2, y);
    }
  }
}
