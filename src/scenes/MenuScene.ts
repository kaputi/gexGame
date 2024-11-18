export class MenuScene implements Scene {
  id = 'menu';

  menus = new Map<string, MenuItem[]>();
  activeMenu = '';
  selectedOption = 0;
  itemHeight = 30;

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.menus.has(this.activeMenu)) return;

    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';

    const items = this.menus.get(this.activeMenu)!;

    const start = height / 2 - (items.length * this.itemHeight) / 2;

    for (let i = 0; i < items.length; i++) {
      const y = start + i * this.itemHeight;
      if (i === this.selectedOption) {
        const textSize = ctx.measureText(items[i].text);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width / 2 - textSize.width / 2, y - 24, textSize.width, 30);
        ctx.fillStyle = '#000000';
      } else ctx.fillStyle = '#ffffff';

      ctx.fillText(items[i].text, width / 2, y);
    }
  }

  addMenu(id: string, menu: MenuItem[]) {
    this.menus.set(id, menu);
  }

  activateMenu(id: string) {
    this.activeMenu = id;
  }

  handleKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        this.selectedOption = Math.max(0, this.selectedOption - 1);
        break;
      case 'ArrowDown':
      case 's':
        this.selectedOption = Math.min(
          this.menus.get(this.activeMenu)!.length - 1,
          this.selectedOption + 1
        );
        break;
      case 'Enter':
        this.menus.get(this.activeMenu)![this.selectedOption].action();
        break;
    }
  }
}
