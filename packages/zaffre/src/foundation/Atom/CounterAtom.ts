import { zutil } from "../Util";
import { Atom, AtomOptions, ZType, atom, zget, znumber } from "./Atom";

//
// A counter atom is a simple numeric atom which can be incremented and decremented. 
// You can also specify options for upper and lower bounds.
//

interface CounterAtomOptions extends AtomOptions {
    minVal?: znumber;
    maxVal?: znumber; 
  }
  export class CounterAtom extends Atom<number> {
    minVal: Atom<number>;
    maxVal: Atom<number>;
    constructor(value: number, public options: CounterAtomOptions) {
      super(value, options);
      this.minVal = atom(() => (zget(this.options.minVal) === undefined ? -Number.MAX_VALUE : zget(this.options.minVal)!));
      this.maxVal = atom(() => (zget(this.options.maxVal) === undefined ? Number.MAX_VALUE : zget(this.options.maxVal)!));
    }
    set(newValue: number): void {
      super.set(zutil.clamp(newValue, this.minVal.get(), this.maxVal.get()));
    }
    increment(delta = 1): number {
      this.set(this.get() + delta); 
      return this.val;
    }
    decrement(delta = 1): number {
      this.set(this.get() - delta);
      return this.val;
    }
    setToMin(): void {
      this.set(this.minVal.get());
    }
    setToMax(): void {
      this.set(this.maxVal.get());
    }
  }
  export function counterAtom(value: number, options: CounterAtomOptions = {}): CounterAtom {
    return new CounterAtom(value, options);
  }
  
  export function counterAtomForDataSelection<T>(data: ZType<T[]>, selection: Atom<T>): CounterAtom {
    const counter = counterAtom(-1, {
      minVal: -1,
      maxVal: atom(() => zget(data).length - 1),
      action: (idx) => selection.set(zget(data)[idx]),
    });
    selection.addAction((item) => counter.set(zget(data).indexOf(item)));
    return counter;
  }