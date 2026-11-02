import { BoxOptions, Checkbox, HStack, SharedViewState, addClass } from "zaffre";
import { atom, TextButton, TextInput } from "zaffre";
import { ToDoModel } from "../Model";
import { ToDoItem } from "../Data";

export interface ToDoItemRowOptions extends BoxOptions {}

export const ToDoItemRow = (item: ToDoItem, model: ToDoModel, inOptions: ToDoItemRowOptions = {}) => {
  const options = addClass(inOptions, "ToDoItemRow");

  const readOnly = atom(true);
  const sharedItemRowState: SharedViewState = {
    hovered: atom(false),
  };
  options.sharedState = sharedItemRowState;
  const completed = atom(item.completed, { action: (val) => (item.completed = val) });
  const content = atom(item.content, { action: (val) => (item.content = val) });

  return HStack(options).append(
    Checkbox(completed),
    TextInput(content, {
      readOnly: readOnly,
      textDecoration: () => (completed.get() ? "line-through" : ""),
      events: {
        //blur: () => model.updateRecord(item),
      },
    }),
    TextButton("x", {
      hidden: () => !sharedItemRowState.hovered?.get(),
      action: () => model.deleteRecord(item),
    }),
  );
};
