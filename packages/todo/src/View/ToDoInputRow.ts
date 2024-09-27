import { core, HStack, pct, Button, View, TextInput } from "zaffre";
import { ToDoModel } from "../Model";
 
export function ToDoInputRow(model: ToDoModel): View {
  return HStack({ width: pct(100), alignItems: "center", paddingBlockStart: core.space.s3 }).append(
    Button({
      leadingIconURI: "icon.chevron-down",
      font: core.font.headline_medium,
      title: "Toggle All",
      padding: core.space.s0,
      action: () => model.toggleAllItems(),
      border: core.border.none,
    }),
    TextInput(model.newText, {
      font: core.font.title_medium,
      placeholder: "What needs to be done?",
      firstFocus: true,
      setOnInput: false,
      readOnly: false,
      width: pct(100),
    })
  );
} 
