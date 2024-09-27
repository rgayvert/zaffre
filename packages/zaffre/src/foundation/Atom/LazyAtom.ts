import { Atom, AtomOptions, atom } from "./Atom";

//
// A LazyAtom contains a cached value, which is calculated only the first time it is requested.
// This is used in TreeNode to provide lazy creation of children.
//

export function lazyAtom<T>(fn: () => T, active = atom(true), options: AtomOptions = {}): LazyAtom<T> {
  return new LazyAtom(fn, active, options);
}

export class LazyAtom<T> extends Atom<T | undefined> {
    
    cachedValue?: T;

    constructor(private fn: () => T, public active = atom(true), public options: AtomOptions = {}) {
      super(undefined, options);
      active.addAction((b) => {
        this.setAndFire(b ? this.getCachedValue() : undefined);
      });
    }

    getCachedValue(): T {
      if (!this.cachedValue) {
        this.cachedValue = this.fn();
      }
      return this.cachedValue;
    }

    get(): T | undefined {
      if (this.val === undefined && this.active.get()) {
        this.val = this.cachedValue || this.fn();
        this.cachedValue = this.val;
      }
      return super.get();
    }
  }
  
