import { zlog, TransferListModel, lorem, pickList } from "zaffre";

export class ExampleTransferModel {
  leftList = pickList([], lorem.uniqueWordList(12), { action: (val) => zlog.info("left: " + val) });
  rightList = pickList([], <string[]>[], { action: (val) => zlog.info("right: " + val) });

  transferModel = new TransferListModel(this.leftList, this.rightList);
}
