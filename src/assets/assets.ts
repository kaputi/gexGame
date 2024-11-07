export type AssetType = 'image' | 'audio';

export interface Asset {
  name: string;
  src: string;
  type: AssetType;
  loaded: boolean;
  load: () => Promise<HTMLImageElement | HTMLAudioElement>;
}

export const ASSET_TYPE_IMAGE: AssetType = 'image';
export const ASSET_TYPE_AUDIO: AssetType = 'audio';

export function getType(src: string): AssetType {
  const extension = src.split('.').pop();
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return ASSET_TYPE_IMAGE;
    case 'mp3':
      return ASSET_TYPE_AUDIO;
    default:
      throw new Error('Unsupported file extension: ' + extension);
  }
}
