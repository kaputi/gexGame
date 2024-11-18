import { Scene } from './types';

export class SceneManager {
  private _activeScenes: Scene[] = [];
  private _scenes = new Map<string, Scene>();

  constructor() {
    document.addEventListener('keydown', (e) => this._activeScenes.at(-1)?.handleKeyDown?.(e));
    document.addEventListener('keyup', (e) => this._activeScenes.at(-1)?.handleKeyUp?.(e));

    document.addEventListener('mousedown', (e) => this._activeScenes.at(-1)?.handleMouseDown?.(e));
    document.addEventListener('mouseup', (e) => this._activeScenes.at(-1)?.handleMouseUp?.(e));
    document.addEventListener('mousemove', (e) => this._activeScenes.at(-1)?.handleMouseMove?.(e));

    // TODO: add support to gamepad using GamePad API
  }

  /**
   * Update the top active scene
   *
   * @param deltaTime The time in ms since last draw
   */
  public update(deltaTime: number): void {
    this._activeScenes.at(-1)?.update?.(deltaTime);
  }

  /**
   * Draws all the active scene
   *
   * @param ctx The canvas rendering context
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    for (let i = 0; i < this._activeScenes.length; i++) {
      this._activeScenes[i].draw(ctx);
    }
  }

  /**
   * Add a scene to the manager
   *
   * @param scene The scene to add
   * @throws Error if a scene with the same id already exists
   */
  public add(scene: Scene): void {
    if (this._scenes.has(scene.id)) throw new Error(`Scene with id ${scene.id} already exists`);
    scene.manager = this;
    this._scenes.set(scene.id, scene);
  }

  /**
   * Remove a scene from the manager
   *
   * @param id The id of the scene to remove
   * @returns The removed scene or null if not found
   */
  public remove(id: string): Scene | null {
    if (!this._scenes.has(id)) return null;

    const isActive = this._activeScenes.findIndex((scene) => scene.id === id);
    if (isActive >= 0) this._activeScenes.splice(isActive, 1);

    const scene = this._scenes.get(id)!;
    this._scenes.delete(id);
    return scene;
  }

  /**
   * Activate a scene and puts it on top
   *
   * @param id The id of the scene to activate
   * @returns The activated scene
   */
  public activate(id: string): Scene {
    const scene = this._scenes.get(id);
    if (!scene) throw new Error(`Scene with id ${id} not found`);
    this._activeScenes.push(scene);
    return scene;
  }

  /**
   * Deactivate a scene if no id is passed the top scene is deactivate
   *
   * @param id The id of the scene to deactivate
   * @returns The deactivated scene or null if no scenes are active
   */
  public deactivate(id?: string): Scene | null {
    if (this._activeScenes.length === 0) return null;
    if (id) {
      const index = this._activeScenes.findIndex((scene) => scene.id === id);
      return this._activeScenes.splice(index, 1)[0];
    } else {
      return this._activeScenes.pop()!;
    }
  }

  public deactivateAll(): void {
    this._activeScenes = [];
  }
}
