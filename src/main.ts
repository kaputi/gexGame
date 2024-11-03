import { Game } from './Game';
import './style.css';
import { CubeCoord, cubeCoord } from './utils/hexCoord';

const center = cubeCoord.create();

const range = cubeCoord.range(center, 6);

const map = new Map<string, CubeCoord>();

range.forEach((v) => {
  map.set(cubeCoord.toString(v), v);
});

const game = new Game(map);

document.addEventListener('mousemove', (e) => {
  const x = e.clientX - game.offsetX;
  const y = e.clientY - game.offsetY;

  // const axial = vecCube.roundAxial([0, 0], [q, r]);
  // const coord = vecCube.fromAxial(vecCube.create(), axial);

  // const id = vecCube.toString(coord);
  // game.selectHex(id);

  console.log(x, y);
});

game.start();
