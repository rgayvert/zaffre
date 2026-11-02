import { VStack, pct, css_width, ViewList } from "zaffre";
import { ToDoModel } from "../Model";
import { ToDoItem } from "../Data";
import { ToDoItemRow } from "./ToDoItemRow";


export const ToDoItemList = (model: ToDoModel, maxWidth: css_width) => {

  const ListItem = (toDoModel: ToDoModel, item: ToDoItem, maxWidth: css_width) => {
    return ToDoItemRow(item, toDoModel, {
      id: `item-${item.id}`,
      maxWidth: maxWidth,
    });
  }
  return VStack({ width: pct(100) }).append(
    ViewList(
      model.filteredRecords,
      (item: ToDoItem) => `item-${item.id}`,
      (item: ToDoItem) => ListItem(model, item, maxWidth)
    )
  );
}
  