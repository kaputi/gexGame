import { Game } from './Game';
import { Hex, POINTY_TOP } from './Hex';
import './style.css';

const config = {
  orientation: POINTY_TOP,
  hexSize: [30, 30],
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
    ['hexTiles', '/myHexes.png'],
    ['mapTest', '/mapTest.json'],
  ];
  assetsToLoad.forEach(([name, src]) => {
    game.assets.add(name, src);
  });

  game.assets.loadAllAssets((asset) => {
    console.log(asset);
  });

  // const randomMap = generateRandomMap(3);
  // console.log(randomMap);

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
