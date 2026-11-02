import { arrayAtom, ArrayAtom, zaget } from "./ArrayAtom";
import { Atom, AtomOptions, zget } from "./Atom";
import { PickList } from "./PickList";

export interface MatchAtomOptions<T> extends AtomOptions {
  //labelFn?: LabelFn<T>;
}



export class MatchAtom<T> extends ArrayAtom<T> {
  constructor(
    public pattern: Atom<string>,
    public list: PickList<T>,
    options: MatchAtomOptions<T> = {}
  ) {
    super(zaget(list.values), options);
    list.values = this;
    pattern.addAction(() => {
      const pat = pattern.get();
      const lowerPat = pat.toLowerCase();
      const match = list.values.find((val) => list.labelFn(val) === pat);
      if (pat === "") {
        list.clearSelection();
        this.set(zget(list.values));
      } else if (match) {
        list.select(match);
        this.set([]);
      } else {
        list.clearSelection();
        const vals = list.values.filter((val) => list.labelFn(val).toLowerCase().includes(lowerPat))
        this.set(vals);
      }
    });
  }
}

export type MatchFn = (s: string) => Promise<string[]>;

export class SearchMatchAtom extends ArrayAtom<string> {
  lastMatchTime = 0;
  minDelta = 500;
  minPatternLength = 2;

  constructor(public pattern: Atom<string>, public matchFn: MatchFn, options: AtomOptions = {}) {
    super([], options);
    pattern.addAction(() => {
      if (this.readyToMatch()) {
        this.updateMatches();
      }
    });
  }

  async updateMatches(): Promise<void> {
    const matches = await this.matchFn(this.pattern.get());
    this.set(matches);
  }

  readyToMatch(): boolean {
    return Date.now() - this.lastMatchTime > this.minDelta && this.pattern.get().length > this.minPatternLength;
  }
}
