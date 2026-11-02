import { atom, counterAtom } from ":foundation";

export class SimpleButtonExampleModel {
  result = atom("");
  downCount = counterAtom(0);
}
