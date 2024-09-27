import { Atom, DerivedAtom } from "../Atom";
import { point2D, Point2D } from "./Geometry2D";
import { slopeBetweenPoints } from "./GeometryFunctions";

//
// A Mapping is a generic function from a domain X to a range Y.
//
// This includes simple cases like linear, piecewise linear, and step functions,
// which are used in many places, such as fluid fonts and window breakpoints.
//

// Domains & ranges:
//  real1
//  integer
//  color: rgb, hsl, ...
//  date
//  string

type domain<X> = (x: X) => boolean;
type range<Y> = (y: Y) => boolean;
type mappingFn<X, Y> = (x: X) => Y;
type inverseMappingFn<X, Y> = (y: Y) => X;
type MappingR1 = Mapping<number, number>;

export interface MappingOptions<X, Y> {
  domain?: domain<X>;
  range?: range<Y>;
  inverse?: inverseMappingFn<X, Y>;
  parameters?: any; // for debugging
}
export class Mapping<X, Y> {
  submaps: Map<domain<X> | undefined, mappingFn<X, Y>> = new Map();
  domain?: domain<X>;

  constructor(public f: mappingFn<X, Y>, public options: MappingOptions<X, Y> = {}) {
    this.submaps.set(options.domain, f);
    this.domain = options.domain;
  }

  at(x: X): Y | undefined {
    for (const [domain, fn] of this.submaps) {
      if (!domain || domain(x)) {
        return fn(x);
      }
    }
    return undefined;
  }
  invert(y: Y): X | undefined {
    return this.options.inverse?.(y);
  }
  append(mapping: Mapping<X, Y>): void {
    this.submaps.set(mapping.domain, mapping.f);
  }
}

export interface LinearOptions extends MappingOptions<number, number> {
  m?: number;
  b?: number;
  pt1?: Point2D;
  pt2?: Point2D;
}
export function linearMapping(options: LinearOptions): MappingR1 {
  let m: number;
  let b: number;
  // normalize
  if (options.pt1 && options.pt2) {
    m = slopeBetweenPoints(options.pt1, options.pt2);
    b = options.pt1.y - m * options.pt1.x;
  } else {
    m = options.m || 0;
    b = options.b || 0;
  }
  const mapOptions: MappingOptions<number, number> = {
    ...options,
    inverse: (y) => (y - b) / m,
    parameters: { m, b },
  };
  return new Mapping((x) => m * x + b, mapOptions);
}

// TODO: should we add an option to extend these mappings beyond the given points? This would eliminate the need to an arbitrary end point.

export function piecewiseLinearMapping(points: Point2D[]): MappingR1 {
  const map = linearMapping({ pt1: points[0], pt2: points[1], domain: (x) => x < points[1].x });
  for (let n = 2; n < points.length; n++) {
    map.append(
      linearMapping({ pt1: points[n - 1], pt2: points[n], domain: (x) => x >= points[n - 1].x && x <= points[n].x })
    );
  }
  return map;
}

export function stepMapping(points: Point2D[]): MappingR1 {
  const map = linearMapping({ pt1: points[0], pt2: point2D(points[1].x, points[0].y), domain: (x) => x < points[1].x });
  for (let n = 2; n < points.length; n++) {
    map.append(
      linearMapping({
        pt1: points[n - 1],
        pt2: point2D(points[n].x, points[n - 1].y),
        domain: (x) => x >= points[n - 1].x && x < points[n].x,
      })
    );
  }
  return map;
}

export class MappingAtom<X, Y> extends DerivedAtom<Y | undefined> {
  constructor(public mapping: Mapping<X, Y>, x: Atom<X>) {
    super(() => mapping.at(x.get()));
  }
}
export type MappingAtomR1 = MappingAtom<number, number>;

export function piecewiseLinearAtom(points: Point2D[], x: Atom<number>): MappingAtomR1 {
  return new MappingAtom(piecewiseLinearMapping(points), x);
}

export function stepFunctionAtom(points: Point2D[], x: Atom<number>): MappingAtomR1 {
  return new MappingAtom(stepMapping(points), x);
}

export function bezier2(
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  options?: MappingOptions<number, Point2D>
): Mapping<number, Point2D> {
  return new Mapping(
    (t: number) =>
      p1
        .scalarMultiply((1 - t) ** 2)
        .add(p2.scalarMultiply(2 * (1 - t) * t))
        .add(p3.scalarMultiply(t ** 2)),
    options
  );
}
export function bezier3(
  p1: Point2D,
  p2: Point2D,
  p3: Point2D,
  p4: Point2D,
  options?: MappingOptions<number, Point2D>
): Mapping<number, Point2D> {
  return new Mapping(
    (t: number) =>
      p1
        .scalarMultiply((1 - t) ** 3)
        .add(p2.scalarMultiply(3 * (1 - t) ** 2 * t))
        .add(p3.scalarMultiply(3 * (1 - t) * t ** 2))
        .add(p4.scalarMultiply(t ** 3)),
    options
  );
}
