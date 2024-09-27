import { zget, ZType, Rect2D, point2D, Point2D, Size2D, Sz2D, cardinalPointToPoint2D, CardinalPoint } from ":foundation";
import { ZWindow } from "./Window";

//
//
//

export type PlacementPoint = CardinalPoint | Point2D;

export type SpecialPlacement = "cursor" | "auto";

export type PlacementSizeFn = (referenceSize: Size2D) => Size2D;

export interface Placement {
  referencePt: PlacementPoint;
  viewPt?: PlacementPoint;
  offset?: Point2D;
  sizeFn?: PlacementSizeFn;
  side?: "inside" | "outside";
}
export type PlacementOption = ZType<Placement | SpecialPlacement>;

export function convertPlacementPointToPoint2D(pt: PlacementPoint): Point2D {
  return pt instanceof Point2D ? pt : cardinalPointToPoint2D(pt);
}
export function outsidePlacementPoint(refPt: PlacementPoint): PlacementPoint {
  const pt = convertPlacementPointToPoint2D(refPt);
  return point2D(1.0 - pt.x, 1.0 - pt.y);
}

function computePlacementOffset(refPt2D: Point2D, viewPt2D: Point2D, viewBox: Rect2D, refBox: Rect2D): Point2D {
  const refLoc = point2D(refPt2D.x * refBox.width, refPt2D.y * refBox.height);
  const viewLoc = point2D(viewPt2D.x * viewBox.width, viewPt2D.y * viewBox.height);
  return refLoc.subtract(viewLoc);
}

// TODO: take into account the size of the viewBox
function autoPlace(viewBox: Rect2D, refBox: Rect2D, delta = 2): Placement {
  const ww = window.innerWidth;
  const wh = window.innerHeight;
  const space = [refBox.left, refBox.top, ww - refBox.right, wh - refBox.bottom];
  if (space[1] < 20) {
    // near the top
    return { referencePt: "xcenter-yend", viewPt: "xcenter-ystart", offset: point2D(0, 2) };
  }
  const maxVal = Math.max(...space);
  const maxIndex = space.indexOf(maxVal);
  const autoPlaces = [
    { referencePt: "xstart-ycenter", viewPt: "xend-ycenter", offset: point2D(delta, 0) }, // left
    { referencePt: "xcenter-ystart", viewPt: "xcenter-yend", offset: point2D(0, -delta) }, // top
    { referencePt: "xend-ycenter", viewPt: "xstart-ycenter", offset: point2D(-delta, 0) }, // right
    { referencePt: "xcenter-yend", viewPt: "xcenter-ystart", offset: point2D(0, delta) }, // bottom
  ];
  return <Placement>autoPlaces[maxIndex];
}
function normalizePlacement(place: Placement): { refPt2D: Point2D, viewPt2D: Point2D, sizeFn?: PlacementSizeFn } {
  const refPt = convertPlacementPointToPoint2D(place.referencePt);
  place.viewPt ??= place.side === "inside" ? place.referencePt : outsidePlacementPoint(place.referencePt);
  const viewPt = convertPlacementPointToPoint2D(place.viewPt);
  return { refPt2D: refPt, viewPt2D: viewPt, sizeFn: place.sizeFn };
}

export function placementOffsetAndSize(viewBox: Rect2D, refBox: Rect2D, placement: PlacementOption = "auto"): { offset: Point2D, size: Size2D } {
  let placeValue = zget(placement) || "auto";

  if (placeValue === "cursor") {
    return { offset: ZWindow.cursorPoint, size: Sz2D(0, 0) };
  } else if (placeValue === "auto") {
    placeValue = autoPlace(viewBox, refBox);
  }
  const { refPt2D, viewPt2D, sizeFn } = normalizePlacement(placeValue);
  const offset = computePlacementOffset(refPt2D, viewPt2D, viewBox, refBox).add(placeValue.offset || point2D(0, 0));
  const size = sizeFn?.(refBox.extent) || Sz2D(0, 0);

  return { offset: offset, size: size };
}
export function placementOffset(viewBox: Rect2D, refBox: Rect2D, placement: PlacementOption = "auto"): Point2D {
  const { offset } = placementOffsetAndSize(viewBox, refBox, placement);
  return offset;
}


export type PlaceName = "left" | "top" | "right" | "bottom" | "center" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export const place: Record<PlaceName, Placement> = {
  left: { referencePt: "xstart-ycenter" },
  top: { referencePt: "xcenter-ystart" },
  right: { referencePt: "xend-ycenter" },
  bottom: { referencePt: "xcenter-yend" },
  center: { referencePt: "xcenter-ycenter", viewPt: "xcenter-ycenter" },
  topLeft: { referencePt: "xstart-ystart" },
  topRight: { referencePt: "xend-ystart" },
  bottomLeft: { referencePt: "xstart-yend" },
  bottomRight: { referencePt: "xend-yend" },

};
