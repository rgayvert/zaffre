
import { Atom, ZType, atom, znumber } from "../Atom";
import { LineSegment2D, Point2D, Rect2D } from "./Geometry2D";

//
// When a geometric object is the value of an atom, it can be cumbersome to deal with
// extracting parts, especially when dealing with CSS/SVG attributes, which usually have
// them split apart. 
//
// Here we provide some functions to make this a bit easier.
//

export type zpoint2D = ZType<Point2D>;
export type zrect2D = ZType<Rect2D>;
export type zsegment2D = ZType<LineSegment2D>;
export type zpath2D = ZType<Path2D>;

export function atomx(pt: zpoint2D): Atom<number> {
  return pt instanceof Atom ? atom(() => pt.get().x) : atom(() => pt.x);
}

export function atomy(pt: zpoint2D): Atom<number> {
  return pt instanceof Atom ? atom(() => pt.get().y) : atom(() => pt.y);
}

 
/** If the given zpoint is an atom, create a pair of atoms; otherwise, create a pair of numbers. */
export function SplitZPoint2D(pt: zpoint2D): [znumber, znumber] {
  if (pt instanceof Atom) {
    return [atom(() => pt.get().x), atom(() => pt.get().y)];
  } else {
    return [pt.x, pt.y];
  }
}
/** If the given zrect is an atom, create a list of 4 atoms; otherwise, create a list of 4 numbers. */
export function SplitZRect2D(rect: zrect2D): [znumber, znumber, znumber, znumber] {
  if (rect instanceof Atom) {
    return [atom(() => rect.get().x), atom(() => rect.get().y), atom(() => rect.get().width), atom(() => rect.get().height)];
  } else {
    return [rect.x, rect.y, rect.width, rect.height];
  }
}

/** If the given zsegment is an atom, create a list of 4 atoms; otherwise, create a list of 4 numbers. */
export function SplitZSegment2D(segment: zsegment2D): [znumber, znumber, znumber, znumber] {
  if (segment instanceof Atom) {
    return [atom(() => segment.get().x1), atom(() => segment.get().y1), atom(() => segment.get().x2), atom(() => segment.get().y2)];
  } else {
    return [segment.x1, segment.y1, segment.x2, segment.y2];
  }
}
 
