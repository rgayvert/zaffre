import { Atom, AtomOptions, ZType, zget, zboolean } from "./Atom";

//
// A CarouselAtom is similar to a CounterAtom is similar to a counter atom, but steps through 
// a generic list of values rather than a sequence of numbers, using next() and previous(). 
// It can be configured to be bounded or circular (the default).
//

export function carouselAtom<T>(data: ZType<T[]>, value: T, options: CarouselAtomOptions = {}): CarouselAtom<T> {
  return new CarouselAtom<T>(data, value, options);
}

export interface CarouselAtomOptions extends AtomOptions {
  circular?: zboolean;
}

export class CarouselAtom<T> extends Atom<T> {
  constructor(public data: ZType<T[]>, value: T, public options: CarouselAtomOptions) {
    super(value, options);
    options.circular ??= true;
    this.setValue(value);
    if (data instanceof Atom) {
      data.addAction(() => this.currentData[this.currentIndex]);
    }
  }
  get currentIndex(): number {
    return this.currentData.includes(this.val) ? this.currentData.indexOf(this.val) : 0;
  }
  set(value: T): void {
    super.set(value);
  }
  get currentData(): T[] {
    return zget(this.data);
  }
  get length(): number {
    return zget(this.data).length;
  }
  setIndex(index: number): void {
    this.set(this.currentData[index]);
  }
  previous(): void {
    const idx = this.currentIndex - 1;
    this.setIndex(zget(this.options.circular) && idx === -1 ? this.length - 1 : Math.max(idx, 0));
  }
  next(): void {
    const idx = this.currentIndex + 1;
    this.setIndex(zget(this.options.circular) ? idx % this.length : Math.min(idx, this.length - 1));
  }
}

