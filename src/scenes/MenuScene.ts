import { Scene } from '@core/scenes';

export interface MenuItem {
  text: string;
  help?: string;
  action: () => unknown;
}

interface Menu {
  selected: number;
  items: MenuItem[];
}

export class MenuScene implements Scene {
  id = 'menu';

  private menus = new Map<string, Menu>();
  private activeMenu = '';
  public itemHeight = 30;

  public addMenu(id: string, menuItems: MenuItem[]) {
    this.menus.set(id, { selected: 0, items: menuItems });
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

    const { items, selected } = this.menus.get(this.activeMenu)!;

    const start = height / 2 - (items.length * this.itemHeight) / 2;

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
