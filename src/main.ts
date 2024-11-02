import { Game } from './Game';
import { Hex } from './hex';
import './style.css';
import { Vec3, vecCube } from './utils/coord';

const center = vecCube.create();

const range = vecCube.range(center, 6);

const map = new Map<string, Vec3>();

range.forEach((v) => {
  map.set(`${v[0]},${v[1]},${v[2]}`, v);
});

const game = new Game(map);

document.addEventListener('mousemove', (e) => {
  if (Hex.size <= 0) return;

  const x = e.clientX - game.offsetX;
  const y = e.clientY - game.offsetY;

  console.log(x, y);

  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / Hex.size;
  const r = ((2 / 3) * y) / Hex.size;

  const axial = vecCube.roundAxial([0, 0], [q, r]);
  const coord = vecCube.fromAxial(axial);

  const id = `${coord[0]},${coord[1]},${coord[2]}`;
  game.selectHex(id);
});

game.start();
