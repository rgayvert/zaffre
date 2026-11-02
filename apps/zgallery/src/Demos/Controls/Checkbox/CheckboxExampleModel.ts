import { atom, toggleAtom } from ":foundation";

export class CheckboxExampleModel {
  cbValueA = toggleAtom(false);
  cbValueB = toggleAtom(false);
  result = atom(() => `A: ${this.cbValueA.get()}, B: ${this.cbValueB.get()}`);
}
