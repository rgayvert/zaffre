import { Atom } from "./Atom";

//
// A BreakpointAtom converts a range of numbers into a set of discrete values. This is
// useful for implementing window breakpoints, where attributes vary based on window size,
// but only when certain boundaries change.
//
// TODO:
//   - move interpolation to somewhere more useful
//   - this seems like it should use a Mapping, since it uses a step function
// 


export function breakpointAtom(breakpoints: number[], initialValue: number): BreakpointAtom {
  const initialIndex = BreakpointAtom.findBreakpointIndex(breakpoints, initialValue);
  return new BreakpointAtom(breakpoints, initialValue, initialIndex);
}

export class BreakpointAtom extends Atom<number> {
  static findBreakpointIndex(breakpoints: number[], val: number): number {
    const index = breakpoints.findIndex((bp) => val < bp);
    return index === -1 ? breakpoints.length : index;
  }

  currentVal: number;
  breakpoints: number[];

  constructor(breakpoints: number[], initialValue: number, initialIndex: number) {
    super(initialIndex);
    this.currentVal = initialValue;
    this.breakpoints = breakpoints;
  }
  addBreakpoint(breakpoint: number): void {
    if (!this.breakpoints.includes(breakpoint)) {
      this.breakpoints.push(breakpoint);
      this.breakpoints.sort((a, b) => a - b);
    }
  }
  set(val: number): void {
    const index = BreakpointAtom.findBreakpointIndex(this.breakpoints, val);
    this.currentVal = val;
    super.set(index);
  }
  index(): number {
    return super.get();
  }
  get(): number {
    super.get();
    return this.currentVal;
  }

  // currently unused

  interpolateWithValues(y: number[]): number {
    const b = this.get();
    const x = this.breakpoints;
    const nx = this.breakpoints.length;
    const ny = y.length; // should be nb+1
    if (b <= x[0]) {
      return y[0];
    }
    if (b >= x[nx - 1]) {
      return y[ny - 1];
    }
    const r = (b - x[0]) / (x[nx - 1] - x[0]);
    return y[0] + (y[ny - 1] - y[0]) * r;
  }
}
