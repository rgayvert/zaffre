import { atom, counterAtom } from "zaffre";

export class SevenCounterModel {
  counter = counterAtom(0);
  count = atom(() => this.counter.get().toString());
}
