import cube, { FLAT_TOP, POINTY_TOP } from '../CubeCoord';

test('cubeCoord basics', () => {
  expect(cube.getOrientation()).toEqual(POINTY_TOP);
  cube.setOrientation(FLAT_TOP);
  expect(cube.getOrientation()).toEqual(FLAT_TOP);
  cube.setOrientation(POINTY_TOP);

  let a = cube.create();

  expect(a).toEqual(new Float32Array([0, 0, 0]));

  a.set([1, 2, 3]);
  expect(a).toEqual(new Float32Array([1, 2, 3]));

  expect(cube.validate(a)).toBe(false);

  expect(() => {
    cube.from(1, 2, 3);
  }).toThrow('Invalid cube coord');

  expect(cube.copy(cube.create(), a)).toEqual(a);

  expect(cube.clone(a)).toEqual(a);

  expect(cube.equal(a, a)).toBe(true);
  expect(cube.equal(a, cube.create())).toBe(false);
});

test('cubeCoord math', () => {
  let a = cube.from(-1, -1, 2);
  let b = cube.from(1, 1, -2);

  let c = cube.create();

  cube.add(c, a, b);

  expect(c).toEqual(new Float32Array([0, 0, 0]));

  cube.subtract(c, a, b);

  expect(c).toEqual(new Float32Array([-2, -2, 4]));

  cube.setValues(c, -2.1, -2.1, 4.1);
  expect(cube.round(c)).toEqual(new Float32Array([-2, -2, 4]));

  cube.scale(c, a, 3);
  expect(c).toEqual(new Float32Array([-3, -3, 6]));

  let d = cube.distance(a, b);

  expect(d).toBe(4);

  cube.lerp(c, a, b, 0.5);
  expect(c).toEqual(new Float32Array([0, 0, 0]));
});

test('cubeCoord space stuff', () => {
  let a = cube.from(3, -3, 0);
  let b = cube.from(1, 1, -2);

  expect(cube.directionVector(cube.create(), a)).toEqual(new Float32Array([1, -1, 0]));

  expect(cube.directionVector(cube.create(), b)).toEqual(new Float32Array([1, 1, -2]));

  expect(cube.directionVector(a, b)).toEqual(new Float32Array([-1, 2, -1]));

  // expect(cube.neighbor(a, 4)).toEqual(new Float32Array([4, -4, 0]));
});
