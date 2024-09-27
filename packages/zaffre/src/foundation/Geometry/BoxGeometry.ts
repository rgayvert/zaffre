import { point2D, Point2D, rect2D, Rect2D } from "./Geometry2D";

//
// This is an assortment of types and functions that deal with boxes, particularly
// with respect to how they are used in Placement.
//

export const BoxSides = ["left", "top", "right", "bottom"] as const;
export type BoxSide = (typeof BoxSides)[number];

export const LogicalSides = ["xstart", "xend", "ystart", "yend"] as const;
export type LogicalSide = (typeof LogicalSides)[number];

export const LogicalCenters = ["xcenter", "ycenter"] as const;
export type LogicalCenter = (typeof LogicalCenters)[number];

export type LogicalAxis = LogicalSide | LogicalCenter;

export type LogicalBox<T> = Map<LogicalSide, T>;

type where = "start" | "center" | "end";
export type CardinalPoint = `x${where}-y${where}`;
export type EdgePoint = Exclude<CardinalPoint, "xcenter-ycenter">;

function convertAxis(axis: LogicalAxis): number {
  return axis.endsWith("start") ? 0.0 : axis.endsWith("end") ? 1.0 : 0.5;
}
export function cardinalPointToPoint2D(pt: CardinalPoint): Point2D {
  const vals = pt.split("-").map((axis) => convertAxis(<LogicalAxis>axis));
  return point2D(vals[0], vals[1]);
}

export function convertBoxSideToEdgePoint(side: BoxSide): EdgePoint {
  return side === "left" ? "xstart-ycenter" : side === "top" ? "xcenter-ystart" : side === "right" ? "xend-ycenter" : "xcenter-yend";
}

function edgePoints(box: Rect2D): [EdgePoint, Point2D][] {
  const [x, y, w, h] = box.toArray();
  return [
    ["xstart-ystart", point2D(x, y)],
    ["xcenter-ystart", point2D(x + w / 2, y)],
    ["xend-ystart", point2D(x + w, y)],

    ["xstart-ycenter", point2D(x, y + h / 2)],
    ["xend-ycenter", point2D(x + w, y + h / 2)],

    ["xstart-yend", point2D(x, y + h)],
    ["xcenter-yend", point2D(x + w / 2, y + h)],
    ["xend-yend", point2D(x + w, y + h)],
  ];
}
export function edgePointNames(): EdgePoint[] {
  return edgePoints(rect2D(0, 0, 0, 0)).map(([pp, pt]) => pp);
}
function cardinalPoints(box: Rect2D): [CardinalPoint, Point2D][] {
  const [x, y, w, h] = box.toArray();
  return [...edgePoints(box), ["xcenter-ycenter", point2D(x + w / 2, y + h / 2)]];
}
export function cardinalPointNames(): CardinalPoint[] {
  return cardinalPoints(rect2D(0, 0, 0, 0)).map(([pp, pt]) => pp);
}

export function closestCardinalPoint(box: Rect2D, pt: Point2D): CardinalPoint {
  const placePts = cardinalPoints(box);
  const d = placePts.map(([_place, p]) => pt.distanceTo(p));
  const place = placePts[d.indexOf(Math.min(...d))][0];
  return place;
}
