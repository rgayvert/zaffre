import { Atom, AsyncAtomAction } from "./Atom";

//
// A DelayedAtom is an atom which has a collection of asynchronous beforeActions, which
// must be completed before its value can be set.
//
// TODO: 
//  - this was previously used for Effects, but has been superceded by addDelayedTriggerAction()
//  - are there other scenarios where this might be useful?
//

export function delayedAtom<T, R>(val: T): DelayedAtom<T, R> {
  return new DelayedAtom(val);
}

export class DelayedAtom<T, R> extends Atom<T> {
  beforeActions: AsyncAtomAction<T, R>[] = [];

  async set(value: T): Promise<void> {
    await Promise.all(this.beforeActions.map((action) => action(value)));
    super.set(value);
  }
  addBeforeAction(a: AsyncAtomAction<T, R>): void {
    this.beforeActions.push(a);
  }
}
