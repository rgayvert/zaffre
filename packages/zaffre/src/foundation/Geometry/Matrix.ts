import { zutil } from "../Util";
import { lazyinit } from "../Support";

//
// Basic Matrix support. 
//

export function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum = sum + a[i] * b[i];
  }
  return sum;
}

// a c 0 tx
// b d 0 ty
// 0 0 1 0
// 0 0 0 1
export function matrix(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix {
  return Matrix.withColumns([
    [a, b, 0, 0],
    [c, d, 0, 0],
    [0, 0, 1, 0],
    [tx, ty, 0, 1],
  ]);
}

export class Matrix {
  static withRows(values: number[][]): Matrix {
    return new Matrix(values);
  }
  static withColumns(values: number[][]): Matrix {
    return this.withRows(values).transpose();
  }

  nrows: number;
  ncols: number;

  constructor(public values: number[][]) {
    this.nrows = values.length;
    this.ncols = values[0].length;
  }
  equals(m: Matrix): boolean {
    if (this.nrows !== m.nrows || this.ncols !== m.ncols) {
      return false;
    }
    for (let i = 0; i < this.nrows; i++) {
      for (let j = 0; j < this.ncols; j++) {
        if (this.values[i][j] !== m.values[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
  applyTo(v: number[]): number[] {
    const answer = new Array(this.nrows);
    for (let i = 0; i < this.nrows; i++) {
      answer[i] = dotProduct(this.row(i), v);
    }
    return answer;
  }
  row(rowNumber: number): number[] {
    return this.values[rowNumber];
  }
  column(colNumber: number): number[] {
    const answer = new Array(this.nrows);
    for (let i = 0; i < this.nrows; i++) {
      answer[i] = this.values[i][colNumber];
    }
    return answer;
  }
  transpose(): Matrix {
    const answer = new Array(this.ncols);
    for (let i = 0; i < this.ncols; i++) {
      answer[i] = new Array(this.nrows);
      for (let j = 0; j < this.nrows; j++) {
        answer[i][j] = this.values[j][i];
      }
    }
    return new Matrix(answer);
  }
  //
  // (m x n) * (n x p) => (m x p)
  //
  multiplyBy(m: Matrix): Matrix {
    if (this.ncols !== m.nrows) {
      throw new Error("invalid matrix dimensions");
    }
    const vals = new Array(this.nrows);
    for (let i = 0; i < this.nrows; i++) {
      vals[i] = new Array(m.ncols);
      for (let j = 0; j < m.ncols; j++) {
        vals[i][j] = dotProduct(this.row(i), m.column(j));
      }
    }
    return new Matrix(vals);
  }

  columnMajorValues(): number[] {
    return zutil
      .sequence(0, this.ncols)
      .map((i) => this.column(i))
      .flat();
  }
}

export class Transform3D extends Matrix {
  @lazyinit static get identity(): Transform3D {
    return this.withRows([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }
  static withRows(values: number[][]): Transform3D {
    return new Transform3D(super.withRows(values).values);
  }
  static withColumns(values: number[][]): Transform3D {
    return new Transform3D(super.withColumns(values).values);
  }
  static ops = new Map<string, (a: number, b: number, c: number, d: number) => Transform3D>([
    ["perspective", this.perspective] as const,
    ["rotateX", this.rotateX],
    ["rotateY", this.rotateY],
    ["rotateZ", this.rotateZ],
    ["rotate", this.rotate],
    ["rotate3d", this.rotate3d],
    ["scale", this.scale],
    ["skew", this.skew],
    ["translate", this.translate],
  ]);
  static transformFromOp(op: string, args: number[]): Transform3D {
    const fn = this.ops.get(op);
    const [a, b, c, d] = args;
    return fn ? fn(a, b, c, d) : this.identity;
  }
  static fromCSS(s: string): Transform3D {
    let answer = Transform3D.identity;
    let idx1 = s.indexOf("(");
    let idx2 = s.indexOf(")");
    while (idx1 !== -1 && idx2 !== -1) {
      const op = s.substring(0, idx1);
      const args = s
        .substring(idx1 + 1, idx2)
        .split(",")
        .map(parseFloat);
      answer = answer.multiplyBy(this.transformFromOp(op, args));
      s = s.substring(idx2 + 1);
      idx1 = s.indexOf("(");
      idx2 = s.indexOf(")");
    }
    return answer;
  }

  isIdentity(): boolean {
    return this.equals(Transform3D.identity);
  }
  multiplyBy(m: Transform3D): Transform3D {
    return super.multiplyBy(m) as Transform3D;
  }
  static perspective(d: number): Transform3D {
    return Transform3D.withColumns([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, -1 / d],
      [0, 0, 0, 1],
    ]);
  }
  perspective(d: number): Transform3D {
    return this.multiplyBy(Transform3D.perspective(d));
  }
  static rotateX(angle: number): Transform3D {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);
    return Transform3D.withColumns([
      [1, 0, 0, 0],
      [0, cosa, -sina, 0],
      [0, sina, cosa, 0],
      [0, 0, 0, 1],
    ]);
  }
  rotateX(angle: number): Transform3D {
    return this.multiplyBy(Transform3D.rotateX(angle));
  }
  static rotateY(angle: number): Transform3D {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);
    return Transform3D.withColumns([
      [cosa, 0, sina, 0],
      [0, 1, 0, 0],
      [-sina, 0, cosa, 0],
      [0, 0, 0, 1],
    ]);
  }
  rotateY(angle: number): Transform3D {
    return this.multiplyBy(Transform3D.rotateY(angle));
  }
  static rotateZ(angle: number): Transform3D {
    const sina = Math.sin(angle);
    const cosa = Math.cos(angle);
    return Transform3D.withColumns([
      [cosa, -sina, 0, 0],
      [sina, cosa, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }
  rotateZ(angle: number): Transform3D {
    return this.multiplyBy(Transform3D.rotateZ(angle));
  }
  static rotate(angle: number): Transform3D {
    return this.rotateZ(angle);
  }
  rotate(angle: number): Transform3D {
    return this.multiplyBy(Transform3D.rotate(angle));
  }
  static rotate3d(x: number, y: number, z: number, a: number): Transform3D {
    const v00 = 1 + (1 - Math.cos(a)) * (x ^ (2 - 1));
    const v10 = -z * Math.sin(a) + x * y * (1 - Math.cos(a));
    const v20 = y * Math.sin(a) + x * z * (1 - Math.cos(a));
    const v01 = z * Math.sin(a) + x * y * (1 - Math.cos(a));
    const v11 = 1 + (1 - Math.cos(a)) * (y ^ (2 - 1));
    const v21 = -x * Math.sin(a) + y * z * (1 - Math.cos(a));
    const v02 = -y * Math.sin(a) + x * z * (1 - Math.cos(a));
    const v12 = x * Math.sin(a) + y * z * (1 - Math.cos(a));
    const v22 = 1 + (1 - Math.cos(a)) * (z ^ (2 - 1));
    return Transform3D.withColumns([
      [v00, v10, v11, 0],
      [v01, v11, v21, 0],
      [v02, v12, v22, 0],
      [0, 0, 0, 1],
    ]);
  }
  rotate3d(x: number, y: number, z: number, a: number): Transform3D {
    return this.multiplyBy(Transform3D.rotate3d(x, y, z, a));
  }
  static scale(sx = 1, sy = 1, sz = 1): Transform3D {
    return Transform3D.withColumns([
      [sx, 0, 0, 0],
      [0, sy, 0, 0],
      [0, 0, sz, 0],
      [0, 0, 0, 1],
    ]);
  }
  scale(sx = 1, sy = 1, sz = 1): Transform3D {
    return this.multiplyBy(Transform3D.scale(sx, sy, sz));
  }
  static skew(ax = 0, ay = 0): Transform3D {
    const tanax = Math.tan(ax);
    const tanay = Math.tan(ay);
    return Transform3D.withColumns([
      [1, tanay, 0, 0],
      [tanax, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }
  skew(ax = 0, ay = 0): Transform3D {
    return this.multiplyBy(Transform3D.skew(ax, ay));
  }
  static translate(tx = 0, ty = 0, tz = 0): Transform3D {
    return Transform3D.withColumns([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [tx, ty, tz, 1],
    ]);
  }
  translate(tx = 0, ty = 0, tz = 0): Transform3D {
    return this.multiplyBy(Transform3D.translate(tx, ty, tz));
  }

  asCSS(): string {
    const v = this.values;
    return `matrix3d(${this.columnMajorValues().join(",")})`;
  }
}
