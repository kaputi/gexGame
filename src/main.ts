import { Game, HexMap } from './Game';
import { Hex, hexUtils } from './Hex';
import './style.css';
import { Graph, GraphNode } from './dataStructures/Graph';

const origin = hexUtils.create();
const range = hexUtils.range(origin, 6);

Hex.size = [30, 30];

// TODO: this should be somewher esle (graph and map)
const map: HexMap = new Map();
const graph = new Graph<Hex>();

range.forEach((v) => {
  const hex = new Hex(...v);
  map.set(hexUtils.toString(v), hex);
  graph.addNode(hex);
});

const hexes = Array.from(map.values());

const randomHex = () => hexes[Math.floor(Math.random() * hexes.length)];

map.forEach((hex) => {
  const neighbors = hex.neighbors();
  neighbors.forEach((neighbor) => {
    const neighborHex = map.get(hexUtils.toString(neighbor));
    if (!neighborHex) return;
    graph.addEdge(hex, neighborHex);
  });
});

const start = randomHex();
let end = randomHex();

if (start === end) {
  while (start === end) {
    end = randomHex();
  }
}

const { nodes } = graph.aStar(start, end)!;
// const { nodes } = graph.djikstra(start, end)!;
// const {nodes} = graph.bfs(start, end)!;

nodes.forEach((hex) => {
  hex.select();
});

const game = new Game(map);

document.addEventListener('mousemove', (e) => {
  const hex = Hex.pointToHex([e.clientX, e.clientY]);
  game.selectHex(hexUtils.toString(hex));
});

game.start();
