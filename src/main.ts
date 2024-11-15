import { Game } from './Game';
import { Hex } from './Hex';
import { POINTY_TOP } from './hexUtils';
import './style.css';
import { WorldMap } from './WorldMap';
import { MapHexMetadata } from './WorldMap/WorldMap';

const config = {
  orientation: POINTY_TOP,
  hexWidth: 128,
  hexHeight: 80,
};

async function initGame() {
  // configure
  Hex.orientation = config.orientation;
  Hex.setDimensions(config.hexWidth, config.hexHeight);

  // init the game
  const game = new Game();

  game.start();

  // setup assets
  const assetsToLoad: string[][] = [
    ['hexTiles', '/myHexes128x148.png'],
    ['mapTest', '/mapTest.json'],
    ['map', '/map.json'],
    ['mapTilesHeight3', '/hexTiles_128x128_height_3x20.png'],
    // ['mapTiles', '/hexTiles_128x128_hex_128x110.5.png'],
    ['mapTiles', '/g32.png'],
  ];

  assetsToLoad.forEach(([name, src]) => {
    game.assets.add(name, src);
  });

  try {
    // await game.assets.loadAllAssets((asset) => {
    //   console.log(asset);
    // });
    await game.assets.loadAllAssets();
  } catch (err) {
    console.error(err);
  }

  // game.setTileSet('mapTiles', 'mapTilesHeight3', 128, 128 + 3 * 20);
  game.setTileSet('mapTiles', 'mapTiles', 128, 128 + 20);

  // const mapMetadata = game.assets.get('mapTest')!.asset.data as {
  const mapMetadata = game.assets.get('map')!.asset.data as {
    name: string;
    locations: MapHexMetadata[];
  };

  const wm = new WorldMap(mapMetadata.name, mapMetadata.locations);
  game.worldMap = wm;

  // const newMetadata = game.worldMap.getMapMetadata();
  // console.log('newMetadata', newMetadata);

  const terrainSelect = document.getElementById('terrainType');
  terrainSelect?.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value as Terrain;
    game.testTerrain = value;
  });

  const downloadMapBtn = document.getElementById('downloadMap');
  downloadMapBtn?.addEventListener('click', () => {
    console.log('clickity');

    const mapJson = JSON.stringify(wm.getMapMetadata(), null, 2);
    const tempElement = document.createElement('a');
    tempElement.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(mapJson)
    );
    tempElement.setAttribute('download', 'map.json');
    tempElement.style.display = 'none';
    document.body.appendChild(tempElement);
    tempElement.click();
    document.body.removeChild(tempElement);
  });

  // const randomMap = generateRandomMap(3);
  // console.log('randomMap', randomMap);
  // console.log(JSON.stringify(randomMap));

  // const map: HexMap = new Map();
  // const graph = new Graph<Hex>();

  // randomMap.forEach(({ coord }) => {
  //   const hex = new Hex(...coord);
  //   map.set(hex.id, hex);
  //   graph.addNode(hex);
  // });

  // const hexes = Array.from(map.values());

  // TODO: the map should be stored in the game state, and the graph should be created on map set
  // map.forEach((hex) => {
  //   const neighbors = hex.neighbors();
  //   neighbors.forEach((neighbor) => {
  //     const neighborHex = map.get(hexUtils.toString(neighbor));
  //     if (!neighborHex) return;
  //     graph.addEdge(hex, neighborHex);
  //   });
  // });

  // test pathFinding /////////////////////////////////////////////////////////
  // const randomHex = () => hexes[Math.floor(Math.random() * hexes.length)];
  // const start = randomHex();
  // let end = randomHex();

  // if (start === end) {
  //   while (start === end) {
  //     end = randomHex();
  //   }
  // }

  // const { nodes } = graph.aStar(start, end)!;
  // // const { nodes } = graph.djikstra(start, end)!;
  // // const {nodes} = graph.bfs(start, end)!;

  // nodes.forEach((hex) => {
  //   hex.select();
  // });

  // test mouse events ////////////////////////////////////////////////////////
  // document.addEventListener('mousemove', (e) => {
  //   const hex = Hex.pointToHex([e.clientX, e.clientY]);
  //   game.selectHex(cube.toString(hex));
  // });
}

initGame();
