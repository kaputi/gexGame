import { vecCube, FLAT_TOP, NEIGHBOR_DIAGONAL, POINTY_TOP, SOUTH, WEST } from '../utils/coord';

test('vecCube basics', () => {
  expect(vecCube.getOrientation()).toEqual(POINTY_TOP);
  vecCube.setOrientation(FLAT_TOP);
  expect(vecCube.getOrientation()).toEqual(FLAT_TOP);
  vecCube.setOrientation(POINTY_TOP);

  let a = vecCube.create();

  expect(a).toEqual([0, 0, 0]);

  a = [1, 2, 3];
  expect(a).toEqual([1, 2, 3]);

  expect(vecCube.validate(a)).toBe(false);

  expect(() => {
    vecCube.fromValues(1, 2, 3);
  }).toThrow('Invalid hex cube vector');

  expect(vecCube.copy(vecCube.create(), a)).toEqual(a);

  expect(vecCube.clone(a)).toEqual(a);

  expect(vecCube.equal(a, a)).toBe(true);
  expect(vecCube.equal(a, vecCube.create())).toBe(false);
});

test('vecCube math', () => {
  let a = vecCube.fromValues(-1, -1, 2);
  let b = vecCube.fromValues(1, 1, -2);

  let c = vecCube.create();

  vecCube.add(c, a, b);

  expect(c).toEqual([0, 0, 0]);

  vecCube.subtract(c, a, b);

  expect(c).toEqual([-2, -2, 4]);

  vecCube.setValues(c, -2.1, -2.1, 4.1);
  expect(vecCube.round(c)).toEqual([-2, -2, 4]);

  vecCube.scale(c, a, 3);
  expect(c).toEqual([-3, -3, 6]);

  let d = vecCube.distance(a, b);

  expect(d).toBe(4);

  vecCube.lerp(c, a, b, 0.5);
  expect(c).toEqual([0, 0, 0]);
});

test('vecCube space stuff', () => {
  let a = vecCube.fromValues(3, -3, 0);
  let b = vecCube.fromValues(1, 1, -2);

  const path = vecCube.path(a, b);
  const resultPath = [
    [3, -3, 0],
    [3, -2, -1],
    [2, -1, -1],
    [2, 0, -2],
    [1, 1, -2],
  ];

  expect(path).toEqual(resultPath);

  const range = vecCube.range(vecCube.create(), 2);
  const resultRange = [
    [-2, 0, 2],
    [-2, 1, 1],
    [-2, 2, 0],
    [-1, -1, 2],
    [-1, 0, 1],
    [-1, 1, 0],
    [-1, 2, -1],
    [0, -2, 2],
    [0, -1, 1],
    [0, 0, 0],
    [0, 1, -1],
    [0, 2, -2],
    [1, -2, 1],
    [1, -1, 0],
    [1, 0, -1],
    [1, 1, -2],
    [2, -2, 0],
    [2, -1, -1],
    [2, 0, -2],
  ];

  expect(range).toEqual(resultRange);

  const range2 = vecCube.range(a, 2);

  const intersection = vecCube.intersection(range, range2);

  const resultInersection = [
    [1, -2, 1],
    [1, -1, 0],
    [2, -2, 0],
    [2, -1, -1],
  ];

  expect(intersection).toEqual(resultInersection);

  const direction = vecCube.directionBetweenCoords(a, b);
  if (!direction) fail('direction shouldnt be false');
  expect(direction.vector).toEqual([-1, 2, -1]);
  expect(direction.neighborType).toBe(NEIGHBOR_DIAGONAL);

  const direction2 = vecCube.directionBetweenCoords(a, vecCube.fromValues(2, 0, -2));
  expect(direction2).toBe(false);

  const c = vecCube.getAtDistance(vecCube.create(), a, direction.vector, 2);
  expect(c).toEqual(b);

  const neighbor = vecCube.neighbor(vecCube.fromValues(1, 0, -1), WEST);
  expect(neighbor).toEqual(vecCube.create());

  const neighborDiagonal = vecCube.diagonalNeighbor(vecCube.fromValues(1, -2, 1), SOUTH);
  expect(neighborDiagonal).toEqual(vecCube.create());

  const ring = vecCube.ring(vecCube.create(), 2);
  const resultRing = [
    [-1, -1, 2],
    [0, -2, 2],
    [1, -2, 1],
    [2, -2, 0],
    [2, -1, -1],
    [2, 0, -2],
    [1, 1, -2],
    [0, 2, -2],
    [-1, 2, -1],
    [-2, 2, 0],
    [-2, 1, 1],
    [-2, 0, 2],
  ];

  expect(ring).toEqual(resultRing);

  const spiral = vecCube.spiral(vecCube.create(), 2);
  const resultSpiral = [
    [0, 0, 0],
    [0, -1, 1],
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
    [-1, -1, 2],
    [0, -2, 2],
    [1, -2, 1],
    [2, -2, 0],
    [2, -1, -1],
    [2, 0, -2],
    [1, 1, -2],
    [0, 2, -2],
    [-1, 2, -1],
    [-2, 2, 0],
    [-2, 1, 1],
    [-2, 0, 2],
  ];

  expect(spiral).toEqual(resultSpiral);

  const cw = vecCube.rotateCW(vecCube.create(), a);
  const ccw = vecCube.rotateCCW(vecCube.create(), a);
  expect(cw).toEqual([3, -0, -3]);
  expect(ccw).toEqual([-0, -3, 3]);

  const reflectQ = vecCube.reflectQ(vecCube.create(), a);
  expect(reflectQ).toEqual([3, 0, -3]);

  const reflectR = vecCube.reflectR(vecCube.create(), a);
  expect(reflectR).toEqual([0, -3, 3]);

  const reflectS = vecCube.reflectS(vecCube.create(), a);
  expect(reflectS).toEqual([-3, 3, 0]);
});
