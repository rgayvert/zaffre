import { zspace, Box, HDivider, Page, ElevatedBox, addClass } from "zaffre";
import { Spacer, ToastStack, VStack, pct, TextLabel, ch } from "zaffre";
import { ToDoModel } from "../Model";
import { ToDoInputRow } from "./ToDoInputRow";
import { ToDoDbSelector } from "./ToDoDbSelector";
import { ToDoItemList } from "./ToDoItemList";
import { ToDoButtonBar } from "./ToDoButtonBar";
import { ToDoOptions, rules } from "./ToDo.rules";

export const ToDo = (inOptions: ToDoOptions = {}) => {
  const model = new ToDoModel();
  const options = addClass(inOptions, "ToDo", rules(model));

  return Page(options).append(
    Box({ padding: zspace.s6 }).append(
      VStack({ width: pct(100), alignItems: "center" }).append(
        TextLabel("todos", { cls: "ToDo_TopLabel" }),
        ElevatedBox().append(
          VStack({ cls: "ToDo_Stack" }).append(
            ToDoInputRow(model),
            HDivider({ width: pct(95), marginBottom: zspace.s4 }),
            ToDoItemList(model, options.maxWidth || ch(100)),
            HDivider({ width: pct(99), marginTop: zspace.s4 }),
            ToDoButtonBar(model),
          ),
        ),
        Spacer("s6"),
        ToDoDbSelector(model),
      ),
    ),
    ToastStack(model.toastItems),
  );
};
