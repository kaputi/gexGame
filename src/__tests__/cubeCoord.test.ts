import { cubeVec, FLAT_TOP, NEIGHBOR_DIAGONAL, POINTY_TOP, SOUTH, WEST } from '../CubeVec';

test('cubeVec basics', () => {
  expect(cubeVec.getOrientation()).toEqual(POINTY_TOP);
  cubeVec.setOrientation(FLAT_TOP);
  expect(cubeVec.getOrientation()).toEqual(FLAT_TOP);
  cubeVec.setOrientation(POINTY_TOP);

  let a = cubeVec.create();

  expect(a).toEqual(new Float32Array([0, 0, 0]));

  a.set([1, 2, 3]);
  expect(a).toEqual(new Float32Array([1, 2, 3]));

  expect(cubeVec.validate(a)).toBe(false);

  expect(() => {
    cubeVec.from(1, 2, 3);
  }).toThrow('Invalid cube vector');

  expect(cubeVec.copy(cubeVec.create(), a)).toEqual(a);

  expect(cubeVec.clone(a)).toEqual(a);

  expect(cubeVec.equal(a, a)).toBe(true);
  expect(cubeVec.equal(a, cubeVec.create())).toBe(false);
});

test('cubeVec math', () => {
  let a = cubeVec.from(-1, -1, 2);
  let b = cubeVec.from(1, 1, -2);

  let c = cubeVec.create();

  cubeVec.add(c, a, b);

  expect(c).toEqual(new Float32Array([0, 0, 0]));

  cubeVec.subtract(c, a, b);

  expect(c).toEqual(new Float32Array([-2, -2, 4]));

  cubeVec.setValues(c, -2.1, -2.1, 4.1);
  expect(cubeVec.round(c)).toEqual(new Float32Array([-2, -2, 4]));

  cubeVec.scale(c, a, 3);
  expect(c).toEqual(new Float32Array([-3, -3, 6]));

  let d = cubeVec.distance(a, b);

  expect(d).toBe(4);

  cubeVec.lerp(c, a, b, 0.5);
  expect(c).toEqual(new Float32Array([0, 0, 0]));
});

test('cubeVec space stuff', () => {
  let a = cubeVec.from(3, -3, 0);
  let b = cubeVec.from(1, 1, -2);

  const path = cubeVec.path(a, b);
  const resultPath = [
    new Float32Array([3, -3, 0]),
    new Float32Array([3, -2, -1]),
    new Float32Array([2, -1, -1]),
    new Float32Array([2, 0, -2]),
    new Float32Array([1, 1, -2]),
  ];

  expect(path).toEqual(resultPath);

  const range = cubeVec.range(cubeVec.create(), 2);
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

  const range2 = cubeVec.range(a, 2);

  const intersection = cubeVec.intersection(range, range2);

  const resultInersection = [
    new Float32Array([1, -2, 1]),
    new Float32Array([1, -1, 0]),
    new Float32Array([2, -2, 0]),
    new Float32Array([2, -1, -1]),
  ];

  expect(intersection).toEqual(resultInersection);

  const direction = cubeVec.directionBetweenCoords(a, b);
  if (!direction) fail('direction shouldnt be false');
  expect(direction.vector).toEqual(new Float32Array([-1, 2, -1]));
  expect(direction.neighborType).toBe(NEIGHBOR_DIAGONAL);

  const direction2 = cubeVec.directionBetweenCoords(a, cubeVec.from(2, 0, -2));
  expect(direction2).toBe(false);

  const c = cubeVec.getAtDistance(cubeVec.create(), a, direction.vector, 2);
  expect(c).toEqual(b);

  const neighbor = cubeVec.neighbor(cubeVec.from(1, 0, -1), WEST);
  expect(neighbor).toEqual(cubeVec.create());

  const neighborDiagonal = cubeVec.diagonalNeighbor(cubeVec.from(1, -2, 1), SOUTH);
  expect(neighborDiagonal).toEqual(cubeVec.create());

  const ring = cubeVec.ring(cubeVec.create(), 2);
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

  const spiral = cubeVec.spiral(cubeVec.create(), 2);
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

  const cw = cubeVec.rotateCW(cubeVec.create(), a);
  const ccw = cubeVec.rotateCCW(cubeVec.create(), a);
  expect(cw).toEqual(new Float32Array([3, -0, -3]));
  expect(ccw).toEqual(new Float32Array([-0, -3, 3]));

  const reflectQ = cubeVec.reflectQ(cubeVec.create(), a);
  expect(reflectQ).toEqual(new Float32Array([3, 0, -3]));

  const reflectR = cubeVec.reflectR(cubeVec.create(), a);
  expect(reflectR).toEqual(new Float32Array([0, -3, 3]));

  const reflectS = cubeVec.reflectS(cubeVec.create(), a);
  expect(reflectS).toEqual(new Float32Array([-3, 3, 0]));
});
