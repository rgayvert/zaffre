import { Spacer, TextButton, TextLabel, HStack, SegmentedButton, StackOptions, addClass } from "zaffre";
import { ToDoModel } from "../Model";

export interface ToDoButtonBarOptions extends StackOptions {}

export const ToDoButtonBar = (model: ToDoModel, inOptions: ToDoButtonBarOptions = {}) => {
  const options = addClass(inOptions, "ToDoButtonBar");
  return HStack(options).append(
    TextLabel(model.count),
    Spacer(1),
    SegmentedButton(model.filterList),
    Spacer(1),
    TextButton("Clear Completed"),
  );
};
