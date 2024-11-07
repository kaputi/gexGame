export type AssetType = 'image' | 'audio' | 'font' | 'json';

export interface Asset {
  name: string;
  src: string;
  type: AssetType;
  loaded: boolean;
  load: () => Promise<unknown>;
  data: unknown;
}
