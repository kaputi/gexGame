declare type AssetType = 'image' | 'audio' | 'font' | 'json';

declare interface Asset {
  name: string;
  src: string;
  type: AssetType;
  loaded: boolean;
  load: () => Promise<unknown>;
  data: unknown;
}

declare interface Scene {
  id: string;
  update?(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  handleKeyDown?(e: KeyboardEvent): void;
  handleKeyUp?(e: KeyboardEvent): void;
  handleMouseDown?(e: MouseEvent): void;
  handleMouseUp?(e: MouseEvent): void;
  handleMouseMove?(e: MouseEvent): void;
}

declare type SpriteMap = Map<string, { start: number; length: number }>;

declare interface MenuItem {
  text: string;
  help?: string;
  subMenu?: Menu;
  action: () => unknown;
}
