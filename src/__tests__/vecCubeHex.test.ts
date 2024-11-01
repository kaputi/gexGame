import { vecHex, FLAT_TOP, NEIGHBOR_DIAGONAL, POINTY_TOP, SOUTH, WEST } from '../VecCubeHex';

test('cubeVec basics', () => {
  expect(vecHex.getOrientation()).toEqual(POINTY_TOP);
  vecHex.setOrientation(FLAT_TOP);
  expect(vecHex.getOrientation()).toEqual(FLAT_TOP);
  vecHex.setOrientation(POINTY_TOP);

  let a = vecHex.create();

  expect(a).toEqual(new Float32Array([0, 0, 0]));

  a.set([1, 2, 3]);
  expect(a).toEqual(new Float32Array([1, 2, 3]));

  expect(vecHex.validate(a)).toBe(false);

  expect(() => {
    vecHex.fromValues(1, 2, 3);
  }).toThrow('Invalid hex cube vector');

  expect(vecHex.copy(vecHex.create(), a)).toEqual(a);

  expect(vecHex.clone(a)).toEqual(a);

  expect(vecHex.equal(a, a)).toBe(true);
  expect(vecHex.equal(a, vecHex.create())).toBe(false);
});

test('cubeVec math', () => {
  let a = vecHex.fromValues(-1, -1, 2);
  let b = vecHex.fromValues(1, 1, -2);

  let c = vecHex.create();

  vecHex.add(c, a, b);

  expect(c).toEqual(new Float32Array([0, 0, 0]));

  vecHex.subtract(c, a, b);

  expect(c).toEqual(new Float32Array([-2, -2, 4]));

  vecHex.setValues(c, -2.1, -2.1, 4.1);
  expect(vecHex.round(c)).toEqual(new Float32Array([-2, -2, 4]));

  vecHex.scale(c, a, 3);
  expect(c).toEqual(new Float32Array([-3, -3, 6]));

  let d = vecHex.distance(a, b);

  expect(d).toBe(4);

  vecHex.lerp(c, a, b, 0.5);
  expect(c).toEqual(new Float32Array([0, 0, 0]));
});

test('cubeVec space stuff', () => {
  let a = vecHex.fromValues(3, -3, 0);
  let b = vecHex.fromValues(1, 1, -2);

  const path = vecHex.path(a, b);
  const resultPath = [
    new Float32Array([3, -3, 0]),
    new Float32Array([3, -2, -1]),
    new Float32Array([2, -1, -1]),
    new Float32Array([2, 0, -2]),
    new Float32Array([1, 1, -2]),
  ];

  expect(path).toEqual(resultPath);

  const range = vecHex.range(vecHex.create(), 2);
  const resultRange = [
    new Float32Array([-2, 0, 2]),
    new Float32Array([-2, 1, 1]),
    new Float32Array([-2, 2, 0]),
    new Float32Array([-1, -1, 2]),
    new Float32Array([-1, 0, 1]),
    new Float32Array([-1, 1, 0]),
    new Float32Array([-1, 2, -1]),
    new Float32Array([0, -2, 2]),
    new Float32Array([0, -1, 1]),
    new Float32Array([0, 0, 0]),
    new Float32Array([0, 1, -1]),
    new Float32Array([0, 2, -2]),
    new Float32Array([1, -2, 1]),
    new Float32Array([1, -1, 0]),
    new Float32Array([1, 0, -1]),
    new Float32Array([1, 1, -2]),
    new Float32Array([2, -2, 0]),
    new Float32Array([2, -1, -1]),
    new Float32Array([2, 0, -2]),
  ];

  expect(range).toEqual(resultRange);

  const range2 = vecHex.range(a, 2);

  const intersection = vecHex.intersection(range, range2);

  const resultInersection = [
    new Float32Array([1, -2, 1]),
    new Float32Array([1, -1, 0]),
    new Float32Array([2, -2, 0]),
    new Float32Array([2, -1, -1]),
  ];

  expect(intersection).toEqual(resultInersection);

  const direction = vecHex.directionBetweenCoords(a, b);
  if (!direction) fail('direction shouldnt be false');
  expect(direction.vector).toEqual(new Float32Array([-1, 2, -1]));
  expect(direction.neighborType).toBe(NEIGHBOR_DIAGONAL);

  const direction2 = vecHex.directionBetweenCoords(a, vecHex.fromValues(2, 0, -2));
  expect(direction2).toBe(false);

  const c = vecHex.getAtDistance(vecHex.create(), a, direction.vector, 2);
  expect(c).toEqual(b);

  const neighbor = vecHex.neighbor(vecHex.fromValues(1, 0, -1), WEST);
  expect(neighbor).toEqual(vecHex.create());

  const neighborDiagonal = vecHex.diagonalNeighbor(vecHex.fromValues(1, -2, 1), SOUTH);
  expect(neighborDiagonal).toEqual(vecHex.create());

  const ring = vecHex.ring(vecHex.create(), 2);
  const resultRing = [
    new Float32Array([-1, -1, 2]),
    new Float32Array([0, -2, 2]),
    new Float32Array([1, -2, 1]),
    new Float32Array([2, -2, 0]),
    new Float32Array([2, -1, -1]),
    new Float32Array([2, 0, -2]),
    new Float32Array([1, 1, -2]),
    new Float32Array([0, 2, -2]),
    new Float32Array([-1, 2, -1]),
    new Float32Array([-2, 2, 0]),
    new Float32Array([-2, 1, 1]),
    new Float32Array([-2, 0, 2]),
  ];

  expect(ring).toEqual(resultRing);

  const spiral = vecHex.spiral(vecHex.create(), 2);
  const resultSpiral = [
    new Float32Array([0, 0, 0]),
    new Float32Array([0, -1, 1]),
    new Float32Array([1, -1, 0]),
    new Float32Array([1, 0, -1]),
    new Float32Array([0, 1, -1]),
    new Float32Array([-1, 1, 0]),
    new Float32Array([-1, 0, 1]),
    new Float32Array([-1, -1, 2]),
    new Float32Array([0, -2, 2]),
    new Float32Array([1, -2, 1]),
    new Float32Array([2, -2, 0]),
    new Float32Array([2, -1, -1]),
    new Float32Array([2, 0, -2]),
    new Float32Array([1, 1, -2]),
    new Float32Array([0, 2, -2]),
    new Float32Array([-1, 2, -1]),
    new Float32Array([-2, 2, 0]),
    new Float32Array([-2, 1, 1]),
    new Float32Array([-2, 0, 2]),
  ];

  expect(spiral).toEqual(resultSpiral);

  const cw = vecHex.rotateCW(vecHex.create(), a);
  const ccw = vecHex.rotateCCW(vecHex.create(), a);
  expect(cw).toEqual(new Float32Array([3, -0, -3]));
  expect(ccw).toEqual(new Float32Array([-0, -3, 3]));

  const reflectQ = vecHex.reflectQ(vecHex.create(), a);
  expect(reflectQ).toEqual(new Float32Array([3, 0, -3]));

  const reflectR = vecHex.reflectR(vecHex.create(), a);
  expect(reflectR).toEqual(new Float32Array([0, -3, 3]));

  const reflectS = vecHex.reflectS(vecHex.create(), a);
  expect(reflectS).toEqual(new Float32Array([-3, 3, 0]));
});
