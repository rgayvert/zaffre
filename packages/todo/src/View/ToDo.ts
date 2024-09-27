import { core, Box, HDivider, Page, place, Spacer, mergeComponentDefaults, ToastStack } from "zaffre";
import { PageOptions, StackOptions, pct, ch, TextLabel, VStack, View } from "zaffre";
import { defineComponentDefaults } from "zaffre";
import { ToDoModel } from "../Model";
import { ToDoInputRow } from "./ToDoInputRow";
import { ToDoStoreSelector } from "./ToDoStoreSelector";
import { ToDoItemList } from "./ToDoItemList";
import { ToDoButtonBar } from "./ToDoButtonBar";

export interface ToDoOptions extends PageOptions {}

defineComponentDefaults<ToDoOptions>("ToDo", "Page", {
  maxWidth: ch(100),
  width: pct(100),
});

export function ToDo(inOptions: ToDoOptions = {}): View {
  const options = mergeComponentDefaults("ToDo", inOptions);
  const model = new ToDoModel();
  options.model = model;

  const stackOptions: StackOptions = {
    width: pct(100),
    rounding: core.rounding.r3,
    elevation: 5,
    alignItems: "center", 
    overflow: "hidden",
    border: core.border.thin,
  };

  return Page(options).append(
    Box({ padding: core.space.s6 }).append(
      VStack({ width: pct(100), alignItems: "center" }).append(
        TextLabel("todos", { font: core.font.display_medium }),
        VStack(stackOptions).append(
          ToDoInputRow(model),
          HDivider({ width: pct(95) }),
          ToDoItemList(model, options.maxWidth || ch(100)),
          HDivider({ width: pct(99) }),
          ToDoButtonBar(model)
        ),
        Spacer(core.space.s6),
        ToDoStoreSelector(model)
      )
    ),
    ToastStack(model.toastItems, {
      placement: place.center,
      maxItems: 1,
      duration: 1500,
    })
  );
}
