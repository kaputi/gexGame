import { Graph } from '../dataStructures';
import { Hex } from '../Hex';
import { cube } from '../hexUtils';

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
      const cubeCoord = cube.fromAxial(coord);
      const hex = new Hex(cubeCoord[0], cubeCoord[1], cubeCoord[2]);
      hex.terrain = terrain;
      this._graph.addNode(hex);
      this.hexes.set(hex.id, hex);
    });

    this.hexes.forEach((hex) => {
      const neighbors = hex.allNeighbors();
      neighbors.forEach((neighbor) => {
        const neighborHex = this.hexes.get(cube.toString(neighbor));
        if (!neighborHex) return;
        this._graph.addEdge(hex, neighborHex);
      });
    });

    this.sortMap();
  }

  getMapMetadata(): { name: string; locations: MapHexMetadata[] } {
    return {
      name: this.name,
      locations: Array.from(this.hexes.values()).map((hex) => ({
        coord: hex.axial,
        terrain: hex.terrain,
      })),
    };
  }

  addMapHex(hex: Hex) {
    this.hexes.set(hex.id, hex);
    this._graph.addNode(hex);
    const neighbors = hex.allNeighbors();
    neighbors.forEach((neighbor) => {
      const neighborHex = this.hexes.get(cube.toString(neighbor));
      if (!neighborHex) return;
      this._graph.addEdge(hex, neighborHex);
    });

    this.sortMap();
  }

  removeMapHex(hex: Hex): Hex | null {
    if (!this.hexes.has(hex.id)) return null;
    this.hexes.delete(hex.id);
    this._graph.removeNode(hex);
    return hex;
  }

  sortMap(): void {
    const arr = Array.from(this.hexes.values());
    const mappedByR = new Map<number, Hex[]>();
    // create maps with hexes by r coord
    arr.forEach((hex) => {
      if (!mappedByR.has(hex.cube[1])) mappedByR.set(hex.cube[1], []);
      mappedByR.get(hex.cube[1])!.push(hex);
    });

    // sort each r coord map by s coord
    mappedByR.forEach((hexes) => {
      hexes.sort((a, b) => a.cube[2] - b.cube[2]);
    });

    // create an array with sorted keys (keys are r coords)
    const keysSorted = Array.from(mappedByR.keys()).sort((a, b) => a - b);

    // create a flat array of hexes sorted by r and s coords
    const flatHexesSorted: Hex[] = [];
    keysSorted.forEach((key) => {
      flatHexesSorted.push(...mappedByR.get(key)!);
    });

    this.hexes = new Map(flatHexesSorted.map((hex) => [hex.id, hex]));
  }
}
