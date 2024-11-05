import { Game, HexMap } from './Game';
import { Hex, hexUtils } from './Hex';
import './style.css';

const origin = hexUtils.create();
const range = hexUtils.range(origin, 6);

Hex.size = [30, 30];

const map: HexMap = new Map();

range.forEach((v) => {
  map.set(hexUtils.toString(v), new Hex(...v));
});

const game = new Game(map);

document.addEventListener('mousemove', (e) => {
  const hex = Hex.pointToHex([e.clientX, e.clientY]);
  game.selectHex(hexUtils.toString(hex));
});

game.start();
