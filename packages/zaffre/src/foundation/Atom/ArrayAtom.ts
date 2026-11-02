import { zutil } from "../Util";
import { Atom, AtomOptions, zget } from "./Atom";

//
// An ArrayAtom is a generic reactive array that provides most of the functionality of an
// array without having to use get(). For example, if val is an ArrayAtom<T>, then val.length
// returns the length of the internal array, and val.at(0) returns first value.
//
// TODO:
//  - try to generalize array handling to use something like ZArrayLike
//  - maybe interface ZArrayLike<T> { length: number; at(n: number): T }
//  - this would work for ArrayAtom<T> and T[], but not ZType<T[]>
//  - maybe introduce zat(n: number), like zget and zset
//

export type ZArray<T> = T[] | ArrayAtom<T>;

export const zaget = <T>(arr: ZArray<T>): T[] => {
  return Array.isArray(arr) ? arr : arr.get();
}

export const zdelete = <T>(arr: ZArray<T>, item: T): void => {
  if (arr instanceof ArrayAtom) {
    arr.delete(item);
  } else {
    const idx = arr.indexOf(item);
    if (idx !== -1) {
      arr.splice(idx, 1);
    }
  }
}



export interface ArrayAtomOptions<T> extends AtomOptions {
  maxLength?: number;
  sortFn?: (a: T, b: T) => number;
}

export class ArrayAtom<T> extends Atom<T[]> {
  constructor(initialContents: T[], public options: ArrayAtomOptions<T> = {}) {
    super(initialContents, options);
  }

  // NB: we need to use this.get() instead of this.val to support derivations

  get length(): number {
    return this.get().length;
  }
  set(newVals: ZArray<T>): ArrayAtom<T> {
    const vals = zaget(newVals);
    super.set(this.options.sortFn ? vals.sort(this.options.sortFn) : vals);
    return this;
  }
  clear(): void {
    this.set([]);
  }
  pop(): T | undefined {
    const answer = this.get().pop();
    this.set([...this.get()]);
    return answer;
  }
  push(...values: T[]): void {
    let newVal = [...this.get(), ...values];
    if (this.options.maxLength && newVal.length > this.options.maxLength) {
      newVal = newVal.slice(0, this.options.maxLength);
    }
    this.set(newVal);
  }
  pushNew(...values: T[]): void {
    let newValues = [...this.get()];
    values.forEach((val) => !newValues.includes(val) && newValues.push(val));
    if (newValues.length > this.length) {
      this.set(newValues);
    }
  }
  insertFirst(val: T): void {
    this.insert(0, val);
  }

  delete(value: T): void {
    this.set(this.get().filter((v) => v !== value));
  }
  deleteSilently(value: T): void {
    this.setValue(this.get().filter((v) => v !== value));
  }
  deleteIndex(index: number): void {
    const newContents = [...this.get()];
    newContents.splice(index, 1);
    this.set(newContents);
  }
  deleteAll(...values: T[]): void {
    this.set(this.get().filter((v) => !values.includes(v)));
  }
  insert(index: number, val: T): void {
    let newContents = [...this.get()];
    newContents.splice(index, 0, val);
    this.set(newContents);
  }
  // returns a simple array with the filtered values
  filter(predicate: (value: T, index: number) => boolean): T[] {
    return this.get().filter(predicate);
  }

  // TODO: figure out how to do this as an overload of filter
  filterWithGuard<U extends T>(pred: (a: T) => a is U): U[] {
    return this.get().filter(pred);
  }

  sort(compareFn?: (a: T, b: T) => number): ArrayAtom<T> {
    this.set([...this.get().sort(compareFn)]);
    return this;
  }
  sortAscending = true;
  toggleSort(compareFn?: (a: T, b: T) => number): void {
    this.sort(compareFn);
    if (!this.sortAscending) {
      this.reverse();
    }
    this.sortAscending = !this.sortAscending;
  }

  sortWith(compareFn: (a: T, b: T) => number, _sortField: string, _sortDirection: string): void {
    this.sort(compareFn);
  }

  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
    this.get().forEach(callbackfn);
  }
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): ArrayAtom<U> {
    return arrayAtom(this.get().map(callbackfn));
  }
  some(callbackfn: (value: T, index: number, array: T[]) => boolean): boolean {
    return this.get().some(callbackfn);
  }
  indexOf(obj: T): number {
    return this.get().indexOf(obj);
  }
  find(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined {
    return this.get().find(predicate);
  }
  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown): number {
    return this.get().findIndex(predicate);
  }
  findLast(predicate: (value: T, index: number, obj: T[]) => unknown): T | undefined {
    return this.get().findLast(predicate);
  }
  includes(obj: T): boolean {
    return this.get().includes(obj);
  }
  at(index: number): T | undefined {
    return this.get().at(index);
  }
  reverse(): void {
    const newContents = [...this.get()].reverse();
    this.set(newContents);
  }
  splice(start: number, deleteCount = 0, ...insertItems: T[]): void {
    const newContents = [...this.get()];
    newContents.splice(start, deleteCount, ...insertItems);
    this.set(newContents);
  }

  spliceOne(index: number, value: T): void {
    this.splice(index, 1, value);
  }
  replace(oldValue: T, newValue: T): void {
    const index = this.indexOf(oldValue);
    if (index !== -1) {
      this.spliceOne(index, newValue);
    }
  }
  removeFirst(): void {
    if (this.length > 0) {
      this.splice(0, 1);
    }
  }
  removeLast(): void {
    if (this.length > 0) {
      this.splice(this.length - 1, 1);
    }
  }
  removeValue(val: T): void {
    const idx = this.indexOf(val);
    if (idx != -1) {
      this.splice(idx, 1);
    }
  }

  slice(start = 0, end = this.length): ArrayAtom<T> {
    return new ArrayAtom(this.get().slice(start, end));
  }
  min(fn: (val: T) => number): number {
    return zutil.min(this.get(), (val) => fn(val));
  }
  max(fn: (val: T) => number): number {
    return zutil.max(this.get(), (val) => fn(val));
  }
  count(fn: (val: T) => boolean): number {
    return zutil.countWhere(this.get(), (val) => fn(val));
  }
  join(delimiter: string): string {
    return this.get().join(delimiter);
  }

  // support spread operator
  *[Symbol.iterator](): IterableIterator<T> {
    let index = 0;
    const r = this.get();
    while (index < r.length) {
      yield r[index++];
    }
  }

  // create a array atom which is created by applying a function to each element of the current contents
  derive<S>(fn: (val: T) => S): ArrayAtom<S> {
    const answer = arrayAtom(this.map((val) => fn(val)));
    this.addAction(() => answer.set(this.map((val) => fn(val)).get()));
    return answer;
  }
  // create an array atom which is created by applying a function to the entire current contents
  // e.g., filtering
  // this array atom will be updated whenever the current one changes
  deriveArray<S>(fn: (array: T[]) => S[]): ArrayAtom<S> {
    const answer = arrayAtom(fn(this.get()));
    this.addAction(() => answer.set(fn(this.get())));
    return answer;
  }

}

export const arrayAtom = <T>(val: T[] | ArrayAtom<T>, options: ArrayAtomOptions<T> = {}): ArrayAtom<T> => {
  if (val instanceof ArrayAtom) {
    val.addAction(options.action);
    return val;
  } else {
    return new ArrayAtom(val, options);
  }
}

export const emptyArrayAtom = <T>(): ArrayAtom<T> => {
  return arrayAtom<T>([]);
}

