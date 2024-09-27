import { Spacer, TextButton, TextLabel, View, atom, core, pct, HStack, SegmentedButton } from "zaffre";
import { ToDoModel } from "../Model";

export function ToDoButtonBar(model: ToDoModel): View {
  return HStack({
    hidden: atom(() => model.itemCount() === 0),
    font: core.font.body_medium,
    width: pct(100),
    padding: core.space.s4,
  }).append(
    TextLabel(model.count, { rounding: core.rounding.r0 }),
    Spacer(1),
    SegmentedButton(model.currentFilterName, model.filterNames, { rounding: core.rounding.r0 }),
    Spacer(1),
    TextButton("Clear Completed", {
      action: () => model.clearCompletedItems(),
      hidden: atom(() => model.completedCount.get() === 0),
    })
  );
}
