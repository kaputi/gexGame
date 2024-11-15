declare type AssetType = 'image' | 'audio' | 'font' | 'json';

declare interface Asset {
  name: string;
  src: string;
  type: AssetType;
  loaded: boolean;
  load: () => Promise<unknown>;
  data: unknown;
}
