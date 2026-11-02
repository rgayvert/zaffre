import { atom, zutil } from ":foundation";

export class VirtualListExampleModel {
  list = zutil.sequence(1, 10000).map((i) => `Item ${i}`);
  selectedItem = atom("");
}
