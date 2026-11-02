import { Atom } from "./Atom";

//
// An AsyncAtom is similar to a TimerAtom, but does not actually have a value; it simply evaluates
// an async function every N msec until it is stopped.
//
// TODO: 
//  - implement stop
//

export type AsyncAction<T> = () => Promise<T>;

export const asyncAtom = <T>(fn: AsyncAction<T>, initialValue: T, interval = 0): AsyncAtom<T> => {
  return new AsyncAtom(fn, initialValue, interval);
}

export class AsyncAtom<T> extends Atom<T> {
  constructor(public fn: AsyncAction<T>, initialValue: T, protected interval = 0) {
    super(initialValue);
    this.getValue();
  }
  async getValue(): Promise<void> {
    const result = await this.fn();
    this.set(result);
    if (this.interval) {
      setTimeout(() => this.getValue(), this.interval);
    }
  }
}
