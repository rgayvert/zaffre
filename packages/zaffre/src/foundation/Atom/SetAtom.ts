import { Atom } from "./Atom";

//
// A Set atom is a generic reactive atom whose value is a Set. 
//

export function setAtom<T>(initialContents: T[] = []): SetAtom<T> {
  return new SetAtom<T>(initialContents);
}

export class SetAtom<T> extends Atom<Set<T>> {

  constructor(initialContents: T[] = []) {
    super(new Set(initialContents));
  }

  clear(): void {
    this.set(new Set());
  }
  add(value: T): void {
    const set = this.val;
    if (!set.has(value)) {
      set.add(value);
      this.performActionsAndDerivations();
    }
  }
  delete(value: T): void {
    const set = this.val;
    if (set.has(value)) {
      set.delete(value);
      this.performActionsAndDerivations();
    }
  }
}
