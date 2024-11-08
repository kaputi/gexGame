export type AssetType = 'image' | 'audio' | 'font' | 'json' | 'tile';

export interface Asset {
  name: string;
  src: string;
  type: AssetType;
  loaded: boolean;
  load: () => Promise<unknown>;
  data: unknown;
}
