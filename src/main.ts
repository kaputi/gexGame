import { TileAsset } from './Assets/TileAsset';
import { Game } from './Game';
import { Hex, hexUtils, POINTY_TOP } from './Hex';
import './style.css';
import { WorldMap } from './WorldMap';
import { MapHexMetadata } from './WorldMap/WorldMap';

const config = {
  orientation: POINTY_TOP,
  hexSize: [128,128],
};

async function initGame() {
  // configure
  Hex.orientation = config.orientation;
  Hex.size = config.hexSize as [number, number];

  // init the game
  const game = new Game();

  game.start();

  // setup assets
  const assetsToLoad: string[][] = [
    ['hexTiles', '/myHexes128x148.png'],
    ['mapTest', '/mapTest.json'],
    ['mapTilesHeight3', '/hexTiles_128x128_height_3x20.png'],
  ];

  assetsToLoad.forEach(([name, src]) => {
    game.assets.add(name, src);
  });

  const mapTiles = game.assets.get('mapTilesHeight3')! .asset as TileAsset;
  console.log(mapTiles)
  mapTiles.tileSize = [128, 128];
  mapTiles.resourceSize = [128, 188];

  try {
    await game.assets.loadAllAssets((asset) => {
      console.log(asset);
    });
  } catch (err) {
    console.error(err);
  }

  const mapMetadata = game.assets.get('mapTest')!.asset.data as {
    name: string;
    locations: MapHexMetadata[];
  };
  console.log('mapMetadata', mapMetadata);
  const wm = new WorldMap(mapMetadata.name, mapMetadata.locations);
  game.worldMap = wm;

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
  document.addEventListener('mousemove', (e) => {
    const hex = Hex.pointToHex([e.clientX, e.clientY]);
    game.selectHex(hexUtils.toString(hex));
  });
}

initGame();
