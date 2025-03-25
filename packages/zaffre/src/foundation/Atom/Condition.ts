import { DerivedAtom, AtomAction, BasicAction, AtomOptions } from "./Atom";

//
// A condition is just a derived boolean atom which fires only when the value becomes true.
//

export function condition(fn: () => boolean, action?: BasicAction, options: AtomOptions = {}): Condition {
  const cond = new Condition(fn, options);
  cond.addAction(action);
  return cond;
}
export class Condition extends DerivedAtom<boolean> {
  public addAction(action?: AtomAction<boolean>): Condition {
    super.addAction(action);
    return this;
  }
  performActionsAndDerivations(): void {
    if (this.val) {
      super.performActionsAndDerivations();
      this.val = false;
    }
  }
}

