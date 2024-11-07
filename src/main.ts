import { Game } from './Game';
import { Hex, POINTY_TOP } from './Hex';
import './style.css';
import { WorldMap } from './WorldMap';
import { MapHexMetadata } from './WorldMap/WorldMap';
import { generateRandomMap } from '../generateRandomMap';
import { sqrt3 } from './utils/math';

const config = {
  orientation: POINTY_TOP,
  hexSize: [64, 64],
  // hexSize: [128 / sqrt3, 74],
};

Hex.orientation = config.orientation;
Hex.size = config.hexSize as [number, number];

const testHex = new Hex(0, 0, 0);
const a = testHex.points;

const maxX = Math.max(...a.map((p) => p[0]));
const maxY = Math.max(...a.map((p) => p[1]));
const minX = Math.min(...a.map((p) => p[0]));
const minY = Math.min(...a.map((p) => p[1]));
console.log('maxX', maxX);
console.log('maxY', maxY);
console.log('minX', minX);
console.log('minY', minY);

const width = maxX - minX;
const height = maxY - minY;
console.log('width', width);
console.log('height', height);
const ratio = height / width;
console.log('ratio', ratio);
console.log('ratio applied to original size', 64 * ratio);
// console.log('sqrt3', sqrt3);


// console.log(sqrt3 * width);

// width = sqrt3 * X
// 128 = sqrt3 * X
//   128 / sqrt3 = X

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
  ];
  assetsToLoad.forEach(([name, src]) => {
    game.assets.add(name, src);
  });

  await game.assets.loadAllAssets((asset) => {
    console.log(asset);
  });

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
  // document.addEventListener('mousemove', (e) => {
  //   const hex = Hex.pointToHex([e.clientX, e.clientY]);
  //   game.selectHex(hexUtils.toString(hex));
  // });
}

initGame();
