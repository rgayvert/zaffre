import { expect, test, describe } from "vitest";
import { Rect2D, rect2D, Point2D, point2D } from ":foundation";

describe("constrainWithin", () => {
  const boxR = rect2D(100, 100, 100, 100);
  const boxA = rect2D(10, 10, 10, 10);
  const boxB = rect2D(40, 110, 10, 10);
  const boxC = rect2D(250, 120, 10, 10);
  const boxD = rect2D(120, 220, 10, 10);

  const boxE = rect2D(120, 120, 10, 10);
  const boxF = rect2D(195, 120, 10, 10);
  const boxG = rect2D(225, 120, 10, 10);


  test("", () => {
    // outside
    console.log("A: "+boxA.constrainWithin(boxR));
    expect(boxA.constrainWithin(boxR)).toEqual(rect2D(100, 100, 10, 10)); 
    console.log("B: "+boxB.constrainWithin(boxR));
    expect(boxB.constrainWithin(boxR)).toEqual(rect2D(100, 110, 10, 10));
    console.log("C: "+boxC.constrainWithin(boxR));
    expect(boxC.constrainWithin(boxR)).toEqual(rect2D(190, 120, 10, 10));
    console.log("D: "+boxD.constrainWithin(boxR));
    expect(boxD.constrainWithin(boxR)).toEqual(rect2D(120, 190, 10, 10));

    // inside
    console.log("E: "+boxE.constrainWithin(boxR));
    expect(boxE.constrainWithin(boxR)).toEqual(rect2D(120, 120, 10, 10));

    // overlapping
    console.log("F: "+boxF.constrainWithin(boxR));
    expect(boxF.constrainWithin(boxR)).toEqual(rect2D(190, 120, 10, 10));
    console.log("G: "+boxG.constrainWithin(boxR));
    expect(boxG.constrainWithin(boxR)).toEqual(rect2D(190, 120, 10, 10));

  
  });
});
