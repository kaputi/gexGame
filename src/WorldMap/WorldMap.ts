import { Graph } from '../dataStructures';
import { AxialCoord, Hex, hexUtils } from '../Hex';

type Terrain = 'grass' | 'forest' | 'river' | 'ocean' | 'desert' | 'mountain' | 'snow' | 'tundra';

export interface MapHexMetadata {
  coord: AxialCoord;
  terrain: Terrain;
}

export class WorldMap {
  hexes = new Map<string, Hex>();
  private _graph = new Graph<Hex>();

  constructor(
    public readonly name: string,
    mapMetadata: MapHexMetadata[]
  ) {
    mapMetadata.forEach(({ coord, terrain }) => {
      const hex = new Hex(...coord);
      hex.terrain = terrain;
      this._graph.addNode(hex);
      this.hexes.set(hex.id, hex);
    });

    this.hexes.forEach((hex) => {
      const neighbors = hex.neighbors();
      neighbors.forEach((neighbor) => {
        const neighborHex = this.hexes.get(hexUtils.toString(neighbor));
        if (!neighborHex) return;
        this._graph.addEdge(hex, neighborHex);
      });
    });
  }
}
