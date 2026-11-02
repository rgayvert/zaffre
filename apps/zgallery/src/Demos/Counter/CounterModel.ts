import { Atom, LocalData, atom, decrementAtom, incrementAtom, zutil } from "zaffre";

export class CounterModel {
  count: Atom<number>;
  countString: Atom<string>;
  mayNotIncrement: Atom<boolean>;
  mayNotDecrement: Atom<boolean>;

  constructor(public key: string, public min = 0, public max = 99, public initialValue = 10) {
    this.count = LocalData.instance.addAtom(`counter.${key}`, zutil.clamp(initialValue, min, max));
    this.countString = atom(() => this.count.get().toString());
    this.mayNotIncrement = atom(() => this.count.get() >= this.max);
    this.mayNotDecrement = atom(() => this.count.get() <= this.min);
  }
  increment(): void {
    incrementAtom(this.count);
  }
  decrement(): void {
    decrementAtom(this.count);
  }
  reset(): void {
    this.count.resetToDefaultValue();
  }
}

export const counterModel = zutil.newless(CounterModel);

