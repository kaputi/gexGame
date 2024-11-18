export interface Scene {
  id: string;
  update?(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  handleKeyDown?(e: KeyboardEvent): void;
  handleKeyUp?(e: KeyboardEvent): void;
  handleMouseDown?(e: MouseEvent): void;
  handleMouseUp?(e: MouseEvent): void;
  handleMouseMove?(e: MouseEvent): void;
}
