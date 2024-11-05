// import { cubeCoord, Coords } from '../utils/hexCoord';
// import { FLAT_TOP, NEIGHBOR_DIAGONAL, POINTY_TOP, SOUTH, WEST } from '../utils/hexCoord/constants';

// test('coord', () => {
//   expect(Coords.orientation).toEqual(POINTY_TOP);
//   Coords.orientation = FLAT_TOP;
//   expect(Coords.orientation).toEqual(FLAT_TOP);
//   Coords.orientation = POINTY_TOP;
// });

// test('cubeCoord basics', () => {
//   let a = cubeCoord.create();

//   expect(a).toEqual([0, 0, 0]);

//   a = [1, 2, 3];
//   expect(a).toEqual([1, 2, 3]);

//   expect(cubeCoord.validate(a)).toBe(false);

//   expect(() => {
//     cubeCoord.fromValues(1, 2, 3);
//   }).toThrow('Invalid hex cube vector');

//   expect(cubeCoord.copy(cubeCoord.create(), a)).toEqual(a);

//   expect(cubeCoord.clone(a)).toEqual(a);

//   expect(cubeCoord.equal(a, a)).toBe(true);
//   expect(cubeCoord.equal(a, cubeCoord.create())).toBe(false);
// });

// test('cubeCoord math', () => {
//   const a = cubeCoord.fromValues(-1, -1, 2);
//   const b = cubeCoord.fromValues(1, 1, -2);

//   const c = cubeCoord.create();

//   cubeCoord.add(c, a, b);

//   expect(c).toEqual([0, 0, 0]);

//   cubeCoord.subtract(c, a, b);

//   expect(c).toEqual([-2, -2, 4]);

//   cubeCoord.setValues(c, -2.1, -2.1, 4.1);
//   expect(cubeCoord.round(cubeCoord.create(), c)).toEqual([-2, -2, 4]);

//   cubeCoord.scale(c, a, 3);
//   expect(c).toEqual([-3, -3, 6]);

//   const d = cubeCoord.distance(a, b);

//   expect(d).toBe(4);

//   cubeCoord.lerp(c, a, b, 0.5);
//   expect(c).toEqual([0, 0, 0]);
// });

// test('cubeCoord space stuff', () => {
//   const a = cubeCoord.fromValues(3, -3, 0);
//   const b = cubeCoord.fromValues(1, 1, -2);

//   const path = cubeCoord.path(a, b);
//   const resultPath = [
//     [3, -3, 0],
//     [3, -2, -1],
//     [2, -1, -1],
//     [2, 0, -2],
//     [1, 1, -2],
//   ];

//   expect(path).toEqual(resultPath);

//   const range = cubeCoord.range(cubeCoord.create(), 2);
//   const resultRange = [
//     [-2, 0, 2],
//     [-2, 1, 1],
//     [-2, 2, 0],
//     [-1, -1, 2],
//     [-1, 0, 1],
//     [-1, 1, 0],
//     [-1, 2, -1],
//     [0, -2, 2],
//     [0, -1, 1],
//     [0, 0, 0],
//     [0, 1, -1],
//     [0, 2, -2],
//     [1, -2, 1],
//     [1, -1, 0],
//     [1, 0, -1],
//     [1, 1, -2],
//     [2, -2, 0],
//     [2, -1, -1],
//     [2, 0, -2],
//   ];

//   expect(range).toEqual(resultRange);

//   const range2 = cubeCoord.range(a, 2);

//   const intersection = cubeCoord.intersection(range, range2);

//   const resultInersection = [
//     [1, -2, 1],
//     [1, -1, 0],
//     [2, -2, 0],
//     [2, -1, -1],
//   ];

//   expect(intersection).toEqual(resultInersection);

//   const direction = cubeCoord.directionBetweenCoords(a, b);
//   if (!direction) fail('direction shouldnt be false');
//   expect(direction.vector).toEqual([-1, 2, -1]);
//   expect(direction.neighborType).toBe(NEIGHBOR_DIAGONAL);

//   const direction2 = cubeCoord.directionBetweenCoords(a, cubeCoord.fromValues(2, 0, -2));
//   expect(direction2).toBe(false);

//   const c = cubeCoord.getAtDistance(cubeCoord.create(), a, direction.vector, 2);
//   expect(c).toEqual(b);

//   const neighbor = cubeCoord.neighbor(cubeCoord.create(), cubeCoord.fromValues(1, 0, -1), WEST);
//   expect(neighbor).toEqual(cubeCoord.create());

//   const neighborDiagonal = cubeCoord.diagonalNeighbor(
//     cubeCoord.create(),
//     cubeCoord.fromValues(1, -2, 1),
//     SOUTH
//   );
//   expect(neighborDiagonal).toEqual(cubeCoord.create());

//   const ring = cubeCoord.ring(cubeCoord.create(), 2);
//   const resultRing = [
//     [-1, -1, 2],
//     [0, -2, 2],
//     [1, -2, 1],
//     [2, -2, 0],
//     [2, -1, -1],
//     [2, 0, -2],
//     [1, 1, -2],
//     [0, 2, -2],
//     [-1, 2, -1],
//     [-2, 2, 0],
//     [-2, 1, 1],
//     [-2, 0, 2],
//   ];

//   expect(ring).toEqual(resultRing);

//   const spiral = cubeCoord.spiral(cubeCoord.create(), 2);
//   const resultSpiral = [
//     [0, 0, 0],
//     [0, -1, 1],
//     [1, -1, 0],
//     [1, 0, -1],
//     [0, 1, -1],
//     [-1, 1, 0],
//     [-1, 0, 1],
//     [-1, -1, 2],
//     [0, -2, 2],
//     [1, -2, 1],
//     [2, -2, 0],
//     [2, -1, -1],
//     [2, 0, -2],
//     [1, 1, -2],
//     [0, 2, -2],
//     [-1, 2, -1],
//     [-2, 2, 0],
//     [-2, 1, 1],
//     [-2, 0, 2],
//   ];

//   expect(spiral).toEqual(resultSpiral);

//   const cw = cubeCoord.rotateCW(cubeCoord.create(), a);
//   const ccw = cubeCoord.rotateCCW(cubeCoord.create(), a);
//   expect(cw).toEqual([3, -0, -3]);
//   expect(ccw).toEqual([-0, -3, 3]);

//   const reflectQ = cubeCoord.reflectQ(cubeCoord.create(), a);
//   expect(reflectQ).toEqual([3, 0, -3]);

//   const reflectR = cubeCoord.reflectR(cubeCoord.create(), a);
//   expect(reflectR).toEqual([0, -3, 3]);

//   const reflectS = cubeCoord.reflectS(cubeCoord.create(), a);
//   expect(reflectS).toEqual([-3, 3, 0]);
// });
