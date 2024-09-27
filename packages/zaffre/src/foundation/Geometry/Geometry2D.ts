import { Serializer } from "../Data";
import { lazyinit } from "../Support";
import { zutil } from "../Util";

//
// Basic geometry classes, including Point2D, Vector2D, Rect2D, Polygon2D, and more.
//

export type Tuple1<T> = [T];
export type Tuple2<T> = [T, T];
export type Tuple3<T> = [T, T, T];
export type Tuple4<T> = [T, T, T, T];
export type Tuple5<T> = [T, T, T, T, T];
export type Tuple6<T> = [T, T, T, T, T, T];

type JSONPoint = ReturnType<Point2D["asJSONObject"]>;

class PointSerializer implements Serializer<Point2D> {
  @lazyinit public static get instance(): PointSerializer {
    return new PointSerializer();
  }
  serialize(pt: Point2D): string {
    return JSON.stringify(pt.asJSONObject());
  }
  deserialize(jsonString: string): Point2D {
    const { x, y }: JSONPoint = JSON.parse(jsonString);
    return point2D(x, y);
  }
}

export function point2D(x: number, y: number): Point2D {
  return new Point2D(x, y);
}
export class Point2D {
  @lazyinit public static get origin(): Point2D {
    return point2D(0, 0);
  }
  constructor(public x: number, public y: number) {}

  serializer(): Serializer<Point2D> {
    return PointSerializer.instance;
  }
  asJSONObject(): any {
    return { x: this.x, y: this.y };
  }

  copy(): Point2D {
    return point2D(this.x, this.y);
  }
  add(pt: Point2D): Point2D {
    return point2D(this.x + pt.x, this.y + pt.y);
  }
  subtract(pt: Point2D): Point2D {
    return point2D(this.x - pt.x, this.y - pt.y);
  }
  scalarMultiply(a: number): Point2D {
    return point2D(a * this.x, a * this.y);
  }
  normalized(): Point2D {
    const mag = this.magnitude();
    return mag === 0 ? this.copy() : this.scalarMultiply(1.0 / this.magnitude());
  }
  negated(): Point2D {
    return point2D(-this.x, -this.y);
  }
  toString(): string {
    return `[${this.asDelimitedList(",")}]`;
  }
  asDelimitedList(delimiter: string): string {
    return `${this.x}${delimiter}${this.y}`;
  }
  asTranslation(): string {
    return `translate(${this.x}px, ${this.y}px)`;
  }
  equals(pt: Point2D): boolean {
    return this.x === pt.x && this.y === pt.y;
  }
  distanceTo(pt: Point2D): number {
    return ((this.x - pt.x) ** 2 + (this.y - pt.y) ** 2) ** 0.5;
  }
  roundTo(places: number): Point2D {
    return point2D(zutil.roundTo(this.x, places), zutil.roundTo(this.y, places));
  }
  clampToRect(rect?: Rect2D): Point2D {
    return rect ? point2D(zutil.clamp(this.x, rect.left, rect.right), zutil.clamp(this.y, rect.top, rect.bottom)) : this;
  }
  dotProduct(v: Point2D): number {
    return this.x * v.x + this.y * v.y;
  }
  magnitude(): number {
    return Math.sqrt(this.dotProduct(this));
  }
  magnitudeSquared(): number {
    return this.dotProduct(this);
  }
  rotatedBy(theta: number): Point2D {
    return point2D(this.x * Math.cos(theta) - this.y * Math.sin(theta), this.y * Math.cos(theta) + this.x * Math.sin(theta));
  }
  extent(extent: Size2D): Rect2D {
    return rect2D(this.x, this.y, extent.width, extent.height);
  }
  corner(extent: Size2D): Rect2D {
    return rect2D(this.x, this.y, this.x + extent.width, this.y + extent.height);
  }

  angle(): number {
    return Math.atan2(-this.y, this.x);
  }
  withAngle(angle: number): Vector2D {
    const mag = this.magnitude();
    return new Vector2D(mag * Math.cos(angle), mag * Math.sin(angle));
  }
}

export function Sz2D(w: number, h: number): Size2D {
  return new Size2D(w, h);
}
export class Size2D extends Point2D {
  get width(): number {
    return this.x;
  }
  get height(): number {
    return this.y;
  }
}

export function vector2D(x: number, y: number): Vector2D {
  return new Vector2D(x, y);
}
export class Vector2D extends Point2D {
  angle(): number {
    return Math.atan2(-this.y, this.x);
  }
  withAngle(angle: number): Vector2D {
    const mag = this.magnitude();
    return new Vector2D(mag * Math.cos(angle), mag * Math.sin(angle));
  }
  scalarMultiply(a: number): Vector2D {
    return super.scalarMultiply(a);
  }
}

type JSONRect2D = ReturnType<Rect2D["asJSONObject"]>;

class Rect2DSerializer implements Serializer<Rect2D> {
  @lazyinit public static get instance(): Rect2DSerializer {
    return new Rect2DSerializer();
  }
  serialize(r: Rect2D): string {
    return JSON.stringify(r.asJSONObject());
  }
  deserialize(jsonString: string): Rect2D {
    const { x, y, width, height }: JSONRect2D = JSON.parse(jsonString);
    return rect2D(x, y, width, height);
  }
}

export type Rect4 = [number, number, number, number];

export function rect2D(x: number, y: number, w: number, h: number): Rect2D {
  return new Rect2D(x, y, w, h);
}
export function Rct2DFromRect4(r: Rect4): Rect2D {
  return new Rect2D(...r);
}

export class Rect2D {
  static union(rects: Rect2D[]): Rect2D {
    const left = Math.min(...rects.map((r) => r.left));
    const top = Math.min(...rects.map((r) => r.top));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    return rect2D(left, top, right - left, bottom - top);
  }
  serializer(): Serializer<Rect2D> {
    return Rect2DSerializer.instance;
  }
  asJSONObject(): any {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  @lazyinit public static get emptyRect(): Rect2D {
    return rect2D(0, 0, 0, 0);
  }
  copy(): Rect2D {
    return rect2D(this.left, this.top, this.width, this.height);
  }

  public static fromDOMRect(r: DOMRect): Rect2D {
    return rect2D(r.left, r.top, r.width, r.height);
  }
  public static fromArray(arr: number[]): Rect2D {
    return rect2D(arr[0], arr[1], arr[2], arr[3]);
  }
  constructor(public x: number, public y: number, public width: number, public height: number) {
    //super();
  }
  public toArray(): number[] {
    return [this.x, this.y, this.width, this.height];
  }
  get extent(): Size2D {
    return Sz2D(this.width, this.height);
  }
  get bottom(): number {
    return this.y + this.height;
  }
  get right(): number {
    return this.x + this.width;
  }
  get left(): number {
    return this.x;
  }
  get top(): number {
    return this.y;
  }
  get center(): Point2D {
    return point2D((this.left + this.right) / 2, (this.top + this.bottom) / 2);
  }
  get topCenter(): Point2D {
    return point2D(this.x + this.width / 2, this.top);
  }
  get rightCenter(): Point2D {
    return point2D(this.right, this.y + this.height / 2);
  }
  get bottomCenter(): Point2D {
    return point2D(this.x + this.width / 2, this.bottom);
  }
  get leftCenter(): Point2D {
    return point2D(this.left, this.y + this.height / 2);
  }
  get topRight(): Point2D {
    return point2D(this.right, this.top);
  }
  get bottomLeft(): Point2D {
    return point2D(this.left, this.bottom);
  }

  public isEmpty(): boolean {
    return this.width === 0 && this.height === 0;
  }
  get origin(): Point2D {
    return point2D(this.x, this.y);
  }
  get corner(): Point2D {
    return point2D(this.right, this.bottom);
  }
  get area(): number {
    return this.width * this.height;
  }
  equals(r: Rect2D): boolean {
    return this.x === r.x && this.y === r.y && this.width === r.width && this.height === r.height;
  }
  contains(r: Rect2D): boolean {
    return this.left <= r.left && this.right >= r.right && this.top <= r.top && this.bottom >= r.bottom;
  }
  containsPoint(pt: Point2D): boolean {
    return this.left <= pt.x && this.right >= pt.x && this.top <= pt.y && this.bottom >= pt.y;
  }
  mergeWith(r: Rect2D): void {
    this.x = this.x || r.x;
    this.y = this.y || r.y;
    this.width = this.width || r.width;
    this.height = this.height || r.height;
  }
  translatedBy(delta: Point2D): Rect2D {
    return rect2D(this.x + delta.x, this.y + delta.y, this.width, this.height);
  }
  translateToOrigin(): Rect2D {
    return rect2D(0, 0, this.width, this.height);
  }
  insetBy(inset: number | number[]): Rect2D {
    const a = Array.isArray(inset) ? <number[]>inset : ((<number[]>Array(4).fill(inset)) as number[]);
    return rect2D(this.x + a[0], this.y + a[1], this.width - (a[0] + a[2]), this.height - (a[1] + a[3]));
  }
  scaleBy(scale: number): Rect2D {
    return rect2D(this.x * scale, this.y * scale, this.width * scale, this.height * scale);
  }
  toString(): string {
    return `[x:${this.x},y:${this.y},w:${this.width},h:${this.height}]`;
  }
  asDelimitedList(delimiter: string): string {
    return [this.x, this.y, this.width, this.height].join(delimiter);
  }
  constrainWithin(rect: Rect2D): Rect2D {
    const x = this.left < rect.left ? rect.left : Math.min(this.left, rect.right - this.width);
    const y = this.top < rect.top ? rect.top : Math.min(this.top, rect.bottom - this.height);
    return rect2D(x, y, Math.min(this.width, rect.width), Math.min(this.height, rect.width));
  }
  roundTo(places: number): Rect2D {
    return Rect2D.fromArray(this.toArray().map((u) => zutil.roundTo(u, places)));
  }
  intersects(rect: Rect2D): boolean {
    return this.origin.x <= rect.corner.x && this.corner.x >= rect.origin.x && this.origin.y <= rect.corner.y && this.corner.y >= rect.origin.y;
  }
}

export class Polygon2D {
  @lazyinit public static get emptyPolygon(): Polygon2D {
    return new Polygon2D([]);
  }
  static fromRotatedRect(width: number, height: number, theta: number): Polygon2D {
    return new Polygon2D([point2D(0, 0), point2D(width, 0), point2D(width, height), point2D(0, height)].map((pt) => pt.rotatedBy(theta)));
  }
  
  constructor(public points: Point2D[]) {}
  toString(): string {
    return `<${this.points.map((pt) => pt.toString()).join(",")}>`;
  }
  asDelimitedList(delimiter: string): string {
    return this.points.map((pt) => pt.asDelimitedList(" ")).join(delimiter);
  }
  translatedBy(delta: Point2D): Polygon2D {
    return new Polygon2D(this.points.map((pt) => pt.add(delta)));
  }
  roundTo(places: number): Polygon2D {
    return new Polygon2D(this.points.map((pt) => pt.roundTo(places)));
  }
}

/**
 * A simple numeric interval with a start and end
 */
export interface Interval {
  start: number;
  end: number;
}

export function isNullInterval(interval: Interval): boolean {
  return interval.start === 0 && interval.end === 0;
}
export function nullInterval(): Interval {
  return { start: 0, end: 0 };
}
export function intervalBoundedBy(interval: Interval, min: number, max: number): Interval {
  if (min > interval.end || max < interval.start) {
    return nullInterval();
  }
  return { start: Math.max(interval.start, min), end: Math.min(interval.end, max) };
}

export function createLineFromPoints(pt1: Point2D, pt2: Point2D): Line2D {
  if (pt1.x === pt2.x) {
    return new Line2D(1, 0, pt1.x);
  } else {
    const m = (pt2.y - pt1.y) / (pt2.x - pt1.x);
    const b = pt2.y - m * pt2.x;
    return createLineFromSlopeAndIntercept(m, b);
  }
}
// assumes line is not vertical
export function createLineFromSlopeAndIntercept(m: number, b: number): Line2D {
  return new Line2D(m, -1, b);
}

// Line2D is a linear expression of the form ax + by + c = 0

export class Line2D {
  constructor(public a: number, public b: number, public c: number) {

  }
  get slope(): number {
    return -this.a / this.b;
  }
  get yIntercept(): number {
    return -this.c / this.b;
  }
  get xIntercept(): number {
    return -this.c / this.a;
  }
}
export function Segment2D(startPt: Point2D, endPt: Point2D): LineSegment2D {
  return new LineSegment2D(startPt.x, startPt.y, endPt.x, endPt.y);
}
export class LineSegment2D {
  @lazyinit public static get emptySegment(): LineSegment2D {
    return new LineSegment2D(0, 0, 0, 0);
  }
  constructor(public x1: number, public y1: number, public x2: number, public y2: number) {
  }
  get startPt(): Point2D {
    return point2D(this.x1, this.y1);
  }
  get endPt(): Point2D {
    return point2D(this.x2, this.y2);
  }
  angle(): number {
    return vector2D(this.x2 - this.x1, this.y2 - this.y1).angle();
  }
  extendToY(y: number): LineSegment2D {
    const q1 = this.startPt;
    const q2 = this.endPt;
    const m = (q2.y - q1.y) / (q2.x - q1.x);
    const b = q1.y - m * q1.x;
    const x = (y - b) / m;
    return Segment2D(this.startPt, point2D(x, y));
  }
}


export class Path2D {
  @lazyinit public static get emptyPath(): Path2D {
    return new Path2D([]);
  }
  constructor(public points: Point2D[]) {

  }

}

export class Circle2D {
  @lazyinit public static get emptyCircle(): Circle2D {
    return new Circle2D(point2D(0, 0), 0);
  }
  constructor(public center: Point2D, public radius: number) {
  }
}

export class Ellipse2D {
  @lazyinit public static get emptyEllipse(): Ellipse2D {
    return new Ellipse2D(point2D(0, 0), 0, 0);
  }
  constructor(public center: Point2D, public radiusX: number, public radiusY: number) {
  }
}