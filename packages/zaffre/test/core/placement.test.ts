import { expect, test, describe } from "vitest";
import { rect2D, point2D } from ":foundation";
import { placementOffset } from ":uifoundation";

describe("place 1", () => {
  const viewBox = rect2D(10, 10, 10, 10);
  const refBox = rect2D(100, 100, 100, 100);

  test("", () => {
    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xcenter-ycenter" })).toEqual(point2D(45, 45));
    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xstart-ycenter" })).toEqual(point2D(50, 45));
    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xcenter-ycenter" })).toEqual(point2D(45, 45));
    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xend-ycenter" })).toEqual(point2D(40, 45));

    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xcenter-ystart" })).toEqual(point2D(45, 50));
    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xcenter-ycenter" })).toEqual(point2D(45, 45));
    expect(placementOffset(viewBox, refBox, { referencePt: "xcenter-ycenter", viewPt: "xcenter-yend" })).toEqual(point2D(45, 40));

    expect(placementOffset(viewBox, refBox, { referencePt: "xstart-ystart", viewPt: "xstart-ystart" })).toEqual(point2D(0, 0));
    expect(placementOffset(viewBox, refBox, { referencePt: "xend-yend", viewPt: "xend-yend" })).toEqual(point2D(90, 90));

    expect(placementOffset(viewBox, refBox, { referencePt: "xstart-yend", viewPt: "xstart-ystart" })).toEqual(point2D(0, 100));
    expect(placementOffset(viewBox, refBox, { referencePt: "xend-ycenter", viewPt: "xstart-ycenter" })).toEqual(point2D(100, 45));

  });
});
