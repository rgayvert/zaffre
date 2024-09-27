import { VStack, View, effectPair, transitions, pct, css_width, ViewList } from "zaffre";
import { ToDoModel } from "../Model";
import { ToDoRecord } from "../Data";
import { ToDoItemRow } from "./ToDoItemRow";

function ListItem(model: ToDoModel, item: ToDoRecord, maxWidth: css_width): View {
  return ToDoItemRow(item, model, {  
    id: `item-${item.recordID}`,
    maxWidth: maxWidth, 
    effects: {
      mounted: effectPair(transitions.fadeIn("in"), transitions.slide("out", "left", 0.3)),
    },
  });
}
export function ToDoItemList(model: ToDoModel, maxWidth: css_width): View {
  return VStack({ width: pct(100) }).append(
    ViewList(
      model.filteredRecords,
      (item: ToDoRecord) => `item-${item.recordID}`,
      (item: ToDoRecord) => ListItem(model, item, maxWidth)
    )
  );
}
 