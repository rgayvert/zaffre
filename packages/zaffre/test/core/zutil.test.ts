import { expect, test, describe } from "vitest";
import { zutil } from ":foundation";
//import { zutil } from "../../src/foundation";


describe("withoutUndefinedValues", () => {
  const dummy1 = {
    a: 2,
    b: 0,
    c: undefined,
    d: "abc",
  };
  test("one undefined value", () => {
    expect(zutil.withoutUndefinedValues(dummy1)).toEqual({ a: 2, b: 0, d: "abc" });
  });
});

describe("formatSeconds", () => {

  test("2", () => {
    expect(zutil.formatSeconds(404.963, 1)).toBe("00:06:45.0");
  });
  test("1", () => {
    expect(zutil.formatSeconds(404.141, 1)).toBe("00:06:44.1");
  });
});

describe("roundTo", () => {
  test("rounding to 0 places", () => {
    expect(zutil.roundTo(10.12345, 0)).toBe(10);
  });
  test("rounding to 1 place", () => {
    expect(zutil.roundTo(10.12345, 1)).toBe(10.1);
  });
  test("rounding to 2 places", () => {
    expect(zutil.roundTo(10.125, 2)).toBe(10.13);
  });
  test("rounding to 2 places", () => {
    expect(zutil.roundTo(1.005, 2)).toBe(1.01);
  });
});

// value in [left, right)
const inRightHalfOpenInterval = (value: number, left: number, right: number): boolean => value >= left && value < right;

// value in [left, right]
const inClosedInterval = (value: number, left: number, right: number): boolean => value >= left && value <= right;

describe("randomInt", () => {
  test("1 to 10", () => {
    for (let i = 0; i < 1000; i++) {
      expect(zutil.randomInt(1, 10)).toSatisfy((val: number) => inClosedInterval(val, 1, 10));
    }
  });
});

describe("sequence", () => {
  test("10 integers", () => {
    expect(zutil.sequence(1, 10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
  test("5 integers starting at 3", () => {
    expect(zutil.sequence(3, 5)).toEqual([3, 4, 5, 6, 7]);
  });
  test("5 integers starting at 3 with step of 2", () => {
    expect(zutil.sequence(3, 5, 2)).toEqual([3, 5, 7, 9, 11]);
  });
  test("geometric", () => {
    expect(zutil.geometricSequence(2, 3, 4)).toEqual([2, 6, 18, 54]);
  });
  test("100 integers", () => {
    //console.log(zutil.sequence(1, 10).slice(1));
    expect(zutil.sequence(1, 10)).toSatisfy((vals: number[]) => vals[0] === 1 && vals.slice(1).every((v, index) => v === vals[index] + 1));
  });
});

describe("randomSequence", () => {
  test("1 to 10", () => {
    for (let i = 0; i < 10; i++) {
      // 10 unique values in [1, 10]
      expect(zutil.randomSequence(1, 10)).toSatisfy(
        (vals: number[]) => new Set(vals).size === vals.length && vals.every((v) => inClosedInterval(v, 1, 10))
      );
    }
  });
});

describe("cumulativeSum", () => {
  test("1 to 6", () => {
    expect(zutil.cumulativeSum(zutil.sequence(1, 6))).toEqual([1, 3, 6, 10, 15, 21]);
  });
});

describe("moveElementFirst", () => {
  const a = [1, 2, 3, 4, 5];

  test("0", () => {
    expect(zutil.moveElementFirst(a, 0)).toEqual([1, 2, 3, 4, 5]);
  });
  test("1", () => {
    expect(zutil.moveElementFirst(a, 1)).toEqual([2, 1, 3, 4, 5]);
  });
  test("2", () => {
    expect(zutil.moveElementFirst(a, 2)).toEqual([3, 1, 2, 4, 5]);
  });
});
