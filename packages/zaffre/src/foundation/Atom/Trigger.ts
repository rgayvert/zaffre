import { Atom, AtomOptions } from "./Atom";

//
// A trigger is just an atom no meaningful value, which fires when set
//

export const trigger = (options: AtomOptions = {}): Trigger => {
  return new Trigger(options);
};
export class Trigger extends Atom<number> {
  constructor(options: AtomOptions = {}) {
    super(0, options);
    options.alwaysFire = true;
  }
  set(): void {
    super.set(1);
  }
}
