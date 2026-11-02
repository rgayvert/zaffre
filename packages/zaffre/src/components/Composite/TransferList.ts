import { SimpleAction, TAction } from ":foundation";
import { addClass, zspace } from ":core";
import { HStack, Spacer, StackOptions, VStack } from "../Layout";
import { Button } from "../Controls";
import { TransferListModel } from "./TransferListModel";
import { ListBox } from "./ListBox";

export interface TransferListOptions extends StackOptions {
  dblClickAction?: TAction<unknown>;
  onClick?: SimpleAction;
}

export const TransferList = <T>(model: TransferListModel<T>, inOptions: TransferListOptions = {}) => {
  const options = addClass(inOptions, "TransferList");

  return HStack(options).append(
    ListBox(model.leftList),
    VStack({ gap: zspace.s3 }).append(
      Button({ cls: "TransferList_LeftButton", action: () => model.moveLeftSelection() }),
      Spacer("s3"),
      Button({ cls: "TransferList_RightButton", action: () => model.moveRightSelection() }),
    ),
    ListBox(model.rightList),
  );
};
