import { zutil } from "../Util";
import { Atom, AtomOptions } from "./Atom";

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

export function arrayAtom<T>(initialContents: T[], options: ArrayAtomOptions = {}): ArrayAtom<T> {
  return new ArrayAtom(initialContents, options);
}

export interface ArrayAtomOptions extends AtomOptions {
  maxLength?: number;
}

export class ArrayAtom<T> extends Atom<T[]> {
  constructor(initialContents: T[], public options: ArrayAtomOptions = {}) {
    super(initialContents, options);
  }

  // NB: we need to use this.get() instead of this.val to support derivations

  get length(): number {
    return this.get().length;
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
    const newValues = [...this.get()];
    values.forEach((val) => !newValues.includes(val) && newValues.push(val));
    if (newValues.length > this.length) {
      this.set(newValues);
    }
  }
  
  delete(value: T): void {
    this.set(this.get().filter((v) => v !== value));
  }
  deleteIndex(index: number): void {
    const newContents = [...this.get()];
    newContents.splice(index, 1);
    this.set(newContents);
  }
  insert(index: number, val: T): void {
    const newContents = [...this.get()];
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


  sort(compareFn?: (a: T, b: T) => number): void {
    this.set([...this.get().sort(compareFn)]);
  }
  sortAscending = true;
  toggleSort(compareFn?: (a: T, b: T) => number): void {
    this.sort(compareFn);
    if (!this.sortAscending) {
      this.reverse();
    }
    this.sortAscending = !this.sortAscending;
  }
  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void {
    this.get().forEach(callbackfn);
  }
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[] {
    return this.get().map(callbackfn);
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
    // const newContents = [...this.get()];
    // newContents.splice(index, 1, value);
    // this.set(newContents);
  }
  replace(oldValue: T, newValue: T): void {
    const index = this.indexOf(oldValue);
    if (index !== -1) {
      this.spliceOne(index, newValue);
    }
  }

  slice(start = 0, end = 0): ArrayAtom<T> {
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

  // support spread operator
  *[Symbol.iterator](): IterableIterator<T> {
    let index = 0;
    const r = this.get();
    while (index < r.length) {
        yield r[index++];
    }
}

}
