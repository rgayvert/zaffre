import { LabelFn, nullish } from "../Support";
import { zutil } from "../Util";
import { arrayAtom, ArrayAtom, ZArray } from "./ArrayAtom";
import { Atom, atom, AtomOptions, BasicAction, zget } from "./Atom";

//
//

export interface PickListOptions<T> extends AtomOptions {
  labelFn?: LabelFn<T>;
  labels?: ZArray<string>;
  maxSelections?: number;
}

export const actionPickList = <T>(actions: Map<T, BasicAction>, options: PickListOptions<T> = {}): PickList<T> => {
  const keys = Array.from(actions.keys());
  const list = new PickList([], keys, options);
  list.lastSelection.addAction((key) => key && actions.get(key)?.());
  return list;
};

export const pickList = <T>(
  initialSelection: T[] | Atom<T | null>,
  initialValues: ZArray<T>,
  options: PickListOptions<T> = {}
): PickList<T> => {
  const initialSelectionIsAtom = initialSelection instanceof Atom;
  const sel = initialSelectionIsAtom ? initialSelection.get() ? [initialSelection.get()!] : [] : initialSelection;
  const list = new PickList(sel, initialValues, options);
  if (initialSelectionIsAtom) {
    // mirror incoming atom and pickList lastSelection
    initialSelection.addAction((val) => list.lastSelection.set(val));
    list.lastSelection.addAction((val) => val && initialSelection.set(val));
  }
  return list;
};

export const pickOne = <T>(
  choice: Atom<T | null>,
  values: ZArray<T>,
  options: PickListOptions<T> = {}
): PickList<T> => {
  const pick = pickList(choice, values, options);
  pick.lastSelection.addAction((key) => key && choice.set(key));
  return pick;
}

export class PickList<T> extends ArrayAtom<T> {
  labelFn: LabelFn<T>;
  values: ArrayAtom<T>;
  maxSelections: number;
  lastSelection: Atom<T | null>;

  labelForValue(val: T | nullish): string {
    const labels = this.options.labels || [];
    return val ? labels.at(this.values.indexOf(val)) || "" : "";
  }

  constructor(initialSelection: T[], public initialValues: ZArray<T>, public options: PickListOptions<T>) {
    super(initialSelection, options);
    this.values = arrayAtom(initialValues);
    this.maxSelections = options.maxSelections || 1;
    this.lastSelection = atom(initialSelection[0], {
      action: (val) => this.select(val),
      alwaysFire: options.alwaysFire,
    });

    const labels = options.labels;
    if (options.labelFn) {
      this.labelFn = options.labelFn;
    } else if (labels) {
      this.labelFn = (val) => this.labelForValue(val);
    } else {
      this.labelFn = zutil.genericLabelFn;
    }
  }
  get selection(): T[] {
    return this.get();
  }
  select(val: T): void {
    this.selectIndex(this.values.indexOf(val));
  }
  selectItemMatching(fn: (val: T) => boolean): void {
    const item = this.values.find(fn);
    if (item) {
      this.select(item);
    }
  }
  addAndSelect(val: T): void {
    this.values.push(val);
    this.select(val);
  }
  clearSelection(): void {
    this.set([]);
    this.lastSelection.set(null);
  }
  selectIndex(index: number): void {
    const val = this.valueAtIndex(index);
    if (val !== undefined && val !== null) {
      this.lastSelection.set(val);
      if (this.maxSelections === 1) {
        this.set([val]);
      } else if (this.length < this.maxSelections) {
        this.push(val);
      }
    }
  }
  valueAtIndex(index: number): T | undefined {
    return this.values.at(index);
  }
  labelAtIndex(index: number): string {
    return this.labelFn(this.valueAtIndex(index));
  }
  indexOfValue(val: T): number {
    return this.values.indexOf(val);
  }

  selectedIndexes(): number[] {
    return this.map((val) => this.indexOfValue(val)).get();
  }
  selectedIndex(): number {
    const indexes = this.selectedIndexes();
    return indexes.length === 0 ? -1 : indexes[0];
  }
  selectedLabel(): string {
    const val = this.get()[0];
    return val ? this.labelFn(val) : "";
  }
  selectedValue(): T {
    return this.get()[0];
  }

  removeValue(val: T): void {
    super.removeValue(val);
    this.values.removeValue(val);
  }
  addValue(val: T): void {
    this.values.push(val);
  }

  // for key bindings
  selectNext(): void {
    const idx = this.selectedIndex();
    if (idx < this.values.length) {
      this.selectIndex(idx + 1);
    }
  }
  selectPrevious(): void {
    const idx = this.selectedIndex();
    if (idx > 0) {
      this.selectIndex(idx - 1);
    }
  }
  selectFirst(): void {
    this.selectIndex(0);
  }
  selectLast(): void {
    this.selectIndex(this.values.length - 1);
  }
}
