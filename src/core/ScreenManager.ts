export class ScreenManager {
  private _activeScreens: ScreenI[] = [];
  private _screens = new Map<string, ScreenI>();

  constructor() {
    document.addEventListener('keydown', (e) => this._activeScreens.at(-1)?.handleKeyDown?.(e));
    document.addEventListener('keyup', (e) => this._activeScreens.at(-1)?.handleKeyDown?.(e));

    document.addEventListener('mousedown', (e) => this._activeScreens.at(-1)?.handleMouseDown?.(e));
    document.addEventListener('mouseup', (e) => this._activeScreens.at(-1)?.handleMouseUp?.(e));
    document.addEventListener('mousemove', (e) => this._activeScreens.at(-1)?.handleMouseMove?.(e));

    // TODO: add support to gamepad using GamePad API
  }

  /**
   * Update the top active screen
   *
   * @param deltaTime The time in ms since last draw
   */
  public update(deltaTime: number): void {
    this._activeScreens.at(-1)?.update(deltaTime);
  }

  /**
   * Draws all the active screens
   *
   * @param ctx The canvas rendering context
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this._activeScreens.length; i++) {
      this._activeScreens[i].draw(ctx);
    }
  }

  /**
   * Add a screen to the manager
   *
   * @param screen The screen to add
   * @throws Error if a screen with the same id already exists
   */
  public add(screen: ScreenI): void {
    if (this._screens.has(screen.id)) throw new Error(`Screen with id ${screen.id} already exists`);
    this._screens.set(screen.id, screen);
  }

  /**
   * Remove a screen from the manager
   *
   * @param id The id of the screen to remove
   * @returns The removed screen or null if not found
   */
  public remove(id: string): ScreenI | null {
    if (!this._screens.has(id)) return null;

    const isActive = this._activeScreens.findIndex((screen) => screen.id === id);
    if (isActive >= 0) this._activeScreens.splice(isActive, 1);

    const screen = this._screens.get(id)!;
    this._screens.delete(id);
    return screen;
  }

  /**
   * Activate a screen and puts it on top
   *
   * @param id The id of the screen to activate
   */
  public activate(id: string): void {
    const screen = this._screens.get(id);
    if (!screen) throw new Error(`Screen with id ${id} not found`);
    this._activeScreens.push(screen);
  }

  /**
   * Deactivate the top screen
   *
   * @returns The deactivated screen or null if no screens are active
   */
  public deactivate(): ScreenI | null {
    if (this._activeScreens.length === 0) return null;
    return this._activeScreens.pop()!;
  }
}
