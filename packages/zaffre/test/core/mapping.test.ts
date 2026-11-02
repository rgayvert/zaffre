import { expect, test, describe } from "vitest";
import { point2D, linearMapping, piecewiseLinearMapping, stepMapping } from ":foundation";

describe("linearMap", () => {
  test("linear", () => {
    const map1 = linearMapping({ m: 2, b: 3 });
    expect(map1.at(5)).toBe(13);
    expect(map1.invert(13)).toBe(5);

    const map2 = linearMapping({ pt1: point2D(0, 3), pt2: point2D(1, 5) });
    expect(map2.options.parameters.m).toBe(2);
    expect(map2.options.parameters.b).toBe(3);
    expect(map2.at(5)).toBe(13);
  });
});

test("piecewise linear", () => {
  const map1 = linearMapping({ m: 2, b: 3, domain: (x) => x < 0 });
  map1.append(linearMapping({ m: -2, b: 3, domain: (x) => x > 0 }));
  expect(map1.at(0)).toBe(undefined);
  expect(map1.at(-1)).toBe(1);
  expect(map1.at(1)).toBe(1);

  const map3 = piecewiseLinearMapping([point2D(-1, 1), point2D(0, 3), point2D(1, 1)]);
  expect(map3.at(0)).toBe(3);
  expect(map3.at(-1)).toBe(1);
  expect(map3.at(1)).toBe(1);
});


test("step function", () => {
  const map1 = stepMapping([point2D(0, 0), point2D(1, 1), point2D(2, 2), point2D(3, 3)]);
  expect(map1.at(-1)).toBe(0);
  expect(map1.at(0)).toBe(0);
  expect(map1.at(0.5)).toBe(0);
  expect(map1.at(1)).toBe(1);
  expect(map1.at(1.5)).toBe(1);
  expect(map1.at(2)).toBe(2);
  expect(map1.at(2.5)).toBe(2);
  expect(map1.at(3)).toBe(undefined);
});
