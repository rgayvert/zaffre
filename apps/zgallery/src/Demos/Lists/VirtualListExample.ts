import { VirtualList, TextLabel, VStack, px, atom, View, core, zutil } from "zaffre";

class VirtualListModel {
  list = zutil.sequence(1, 10000).map((i) => `Item ${i}`);
}

export function VirtualListExample(): View {
  const model = new VirtualListModel();
  const selectedItem = atom("");

  return VStack({
    padding: core.space.s3,
    alignItems: "start",
    justifyContent: "start",
    overflowY: "scroll",
    width: px(100),
    height: px(200),
    border: core.border.thin,
  }).append(
    VirtualList(
      model.list,
      (dataItem) => dataItem,
      (dataItem, _index) =>
        TextLabel(dataItem, {
          font: core.font.body_small,
          clickAction: () => selectedItem.set(dataItem),
          selected: atom(() => selectedItem.get() === dataItem),
          selectionColor: core.color.tertiary,
        })
    )
  );
}
