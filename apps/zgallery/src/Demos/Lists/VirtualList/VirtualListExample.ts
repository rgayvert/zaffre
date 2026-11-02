import { VirtualList, TextLabel, VStack } from "zaffre";
import { VirtualListExampleModel } from "./VirtualListExample.model";
import { virtualListExampleRules } from "./VirtualListExample.rules";


export const VirtualListExample = () => {
  const model = new VirtualListExampleModel();

  return VStack({ rules: virtualListExampleRules, model: model }).append(
    VirtualList(
      model.list,
      (dataItem) => dataItem,
      (dataItem, _index) =>
        TextLabel(dataItem, {
          clickAction: () => model.selectedItem.set(dataItem),
          selected: () => model.selectedItem.get() === dataItem,
        })
    )
  );
};
