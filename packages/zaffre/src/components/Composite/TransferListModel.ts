import { PickList } from ":foundation";

export class TransferListModel<T> {
  constructor(public leftList: PickList<T>, public rightList: PickList<T>) {
  }

  moveLeftSelection() {
    const item = this.leftList.lastSelection.get();
    if (item) {
      this.leftList.removeValue(item);
      this.rightList.addValue(item);
    }
  }
  moveRightSelection() {
    const item = this.rightList.lastSelection.get();
    if (item) {
      this.rightList.removeValue(item);
      this.leftList.addValue(item);
    }
  }
}