// import { Hex } from './Hex/Hex';
// import { cube } from './hexUtils';
// import { WorldMap } from './WorldMap';

// export class Game {
//   // private cx = 0;
//   // private cy = 0;

//   // worldMap: WorldMap | null = null;

//   // testTerrain: Terrain = 'grass';

//   // private mouseDown = false;
//   // private firstClick: [number, number] | null = null;
//   // private mouseMoved = false;

//   // handleMouseWheel(e: WheelEvent) {
//   //   const mousePos = [e.clientX, e.clientY];

//   //   const hex = Hex.pointToHex(mousePos, false);

//   //   const modifier = e.deltaY > 0 ? 0.9 : 1.1;
//   //   const newWidth = Hex.width * modifier;
//   //   const newHeight = Hex.height * modifier;
//   //   Hex.setDimensions(newWidth, newHeight);
//   //   const newOrigin = [...Hex.origin].map((v) => v * modifier);
//   //   Hex.origin = newOrigin;

//   //   const newPoint = Hex.hexToPoint(hex);

//   //   const diff = [newPoint[0] - mousePos[0], newPoint[1] - mousePos[1]];
//   //   Hex.origin = [Hex.origin[0] - diff[0], Hex.origin[1] - diff[1]];
//   // }

//   // handleMouseDown(e: MouseEvent) {
//   //   this.mouseDown = true;
//   //   this.firstClick = [e.clientX, e.clientY];
//   // }

//   // handleMouseMove(e: MouseEvent) {
//     // const hex = Hex.pointToHex([e.clientX, e.clientY]);
//     // this.selectHex(cube.toString(hex));
//     // if (!this.mouseDown || !this.firstClick) return;
//     // const dist = [e.clientX - this.firstClick[0], e.clientY - this.firstClick[1]];
//     // if (Math.sqrt(dist[0] ** 2 + dist[1] ** 2) < 2) return;
//     // this.mouseMoved = true;
//     // Hex.origin[0] += e.movementX;
//     // Hex.origin[1] += e.movementY;
//   }

//   handleMouseUp(e: MouseEvent) {
//     if (!this.mouseMoved) {
//       // TODO:  this code is for map editor
//       if (!this.worldMap) return;
//       const hexCoord = Hex.pointToHex([e.x, e.y]);
//       const id = cube.toString(hexCoord);

//       if (!this.worldMap.hexes.has(id)) {
//         const hex = new Hex(hexCoord[0], hexCoord[1], hexCoord[2]);
//         hex.terrain = this.testTerrain;
//         this.worldMap.addMapHex(hex);
//       } else this.worldMap.removeMapHex(this.worldMap.hexes.get(id)!);
//       // console.log(JSON.stringify(this.worldMap.getMapMetadata()));
//     }
//     this.mouseDown = false;
//     this.mouseMoved = false;
//   }

//   handleResize() {
//     const windowBBox = document.body.getBoundingClientRect();
//     this._canvas.width = windowBBox.width;
//     this._canvas.height = windowBBox.height;
//     this.cx = windowBBox.width / 2;
//     this.cy = windowBBox.height / 2;
//     Hex.origin = [this.cx, this.cy];
//   }

//   // setTileSet(name: string, assetName: string, tileWidth: number, tileHeight: number) {
//   //   const assetObj = this.assets.get(assetName);
//   //   if (!assetObj) throw new Error('Asset not found');
//   //   const { asset } = assetObj;
//   //   if (asset.type !== ASSET_TYPE_IMAGE) throw new Error('Invalid asset type');
//   //   this.tileSets.set(name, new TileSet(name, asset as ImageAsset, tileWidth, tileHeight));
//   // }

//   // setSpriteShit(
//   //   name: string,
//   //   assetName: string,
//   //   tileWidth: number,
//   //   tileHeight: number,
//   //   spriteMap?: SpriteMap
//   // ) {
//   //   const assetObj = this.assets.get(assetName);
//   //   if (!assetObj) throw new Error('Asset not found');
//   //   const { asset } = assetObj;
//   //   if (asset.type !== ASSET_TYPE_IMAGE) throw new Error('Invalid asset type');
//   //   this.spriteSheet.set(
//   //     name,
//   //     new SpriteSet(name, asset as ImageAsset, tileWidth, tileHeight, 3, 10, spriteMap)
//   //   );
//   // }

//   // selectHex(id: string) {
//   //   if (!this.worldMap || id === this._selectedHex?.id) return;

//   //   if (this._selectedHex) {
//   //     this._selectedHex = null;
//   //   }

//   //   const hex = this.worldMap.hexes.get(id);
//   //   if (!hex) return;
//   //   this._selectedHex = hex;
//   // }
// }
