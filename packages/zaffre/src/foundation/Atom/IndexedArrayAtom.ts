import { ArrayAtom, ArrayAtomOptions } from "./ArrayAtom";

//
// An array containing items that have an extra index field.
// This is useful for lists (like Toast) where we have a list of items that may be
// the same value, but need a unique id.
//
// TODO: 
//  - is this necessary, or can we just use ArrayAtom<T extends IndexedThing>
//

export function indexedArrayAtom<T>(initialContents: T[], options: ArrayAtomOptions = {}): IndexedArrayAtom<T> {
  const contents = initialContents.map((val: T, index: number) => ({ index: index, value: val }));
  return new IndexedArrayAtom(contents, options);
}

export interface ValueWithIndex<T> {
  index: number;
  value: T;
}

export class IndexedArrayAtom<T> extends ArrayAtom<ValueWithIndex<T>> {
  currentIndex = 1;

  addValue(value: T): void {
    super.push({ index: this.currentIndex, value: value });
    this.currentIndex++;
  }
}
