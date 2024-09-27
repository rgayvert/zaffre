import { LineSegment2D, Point2D, Polygon2D, point2D, Segment2D, Vector2D } from "./Geometry2D";

//
// Included here are some basic algorithms involving points, rects, and polygons.
//

export function slopeBetweenPoints(pt1: Point2D, pt2: Point2D): number {
  return (pt2.y - pt1.y) / (pt2.x - pt1.x);
}

// Adapted from https://stackoverflow.com/questions/38807203
export function polygonAroundLineSegment(a: Point2D, b: Point2D, width: number): Polygon2D {
  const dx0 = b.x - a.x;
  const dy0 = b.y - a.y;
  const d = Math.sqrt(dx0 * dx0 + dy0 * dy0);
  const dx = (0.5 * width * dx0) / d;
  const dy = (0.5 * width * dy0) / d;
  return new Polygon2D([point2D(a.x - dy, a.y + dx), point2D(a.x + dy, a.y - dx), point2D(b.x + dy, b.y - dx), point2D(b.x - dy, b.y + dx)]);
}

// Adapted from https://stackoverflow.com/questions/22521982/
export function isPointInsidePolygon(pt: Point2D, polygon: Polygon2D): boolean {
  const vertices = polygon.points;
  let windingNumber = 0;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;
    const intersect = yi > pt.y != yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi;
    windingNumber += intersect ? 1 : 0;
  }
  return windingNumber % 2 === 1;
}

export function shortenLineSegment(segment: LineSegment2D, distance: number): LineSegment2D {
  const v = <Vector2D>(segment.endPt.subtract(segment.startPt));
  const newEndPt = segment.startPt.add(v.normalized().scalarMultiply(v.magnitude() - distance));
  return Segment2D(segment.startPt, newEndPt);
}
export function changeSegmentLength(segment: LineSegment2D, distance: number, where: "head" | "tail" | "both"): LineSegment2D {
  const v = <Vector2D>(segment.endPt.subtract(segment.startPt)).normalized();
  const dv = v.scalarMultiply(v.magnitude() + distance);
  const newStartPt = segment.startPt.add(dv.scalarMultiply(where === "head" || where === "both" ? -1 : 0)); 
  const newEndPt = segment.endPt.add(dv.scalarMultiply(where === "tail" || where === "both" ? 1 : 0)); 
  return Segment2D(newStartPt, newEndPt);
}