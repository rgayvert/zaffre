import { Atom, AtomOptions } from "./Atom";

//
//
//

export function toggleAtom(value: boolean, options: AtomOptions = {}): ToggleAtom {
  return new ToggleAtom(value, options);
}

export class ToggleAtom extends Atom<boolean> {
  negation: ToggleAtom;

  constructor(value: boolean, public options: AtomOptions = {}, negation?: ToggleAtom) {
    super(value, options);
    // note: if negation is created, it does not get the action of the original
    this.negation = negation || new ToggleAtom(!value, {}, this);
  }

  set(value: boolean, setNegation = true): void {
    super.set(value);
    if (setNegation) {
      this.negation.set(!value, false);
    }
  }

  async setAsync(value: boolean, setNegation = true): Promise<void> {
    super.setAsync(value);
    if (setNegation) {
      this.negation.setAsync(!value, false);
    }
  }

  toggle(): void {
    this.set(!this.get());
  }

  async toggleAsync(): Promise<void> {
    this.setAsync(!this.get());
  }
}