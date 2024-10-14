import { View, BoxOptions, Checkbox, HStack, SharedViewState } from "zaffre";
import { TextButton, TextInput, Atom, BV, restoreOptions } from "zaffre";
import { atom, calc, core, pct, em, tableRecordEditor } from "zaffre";
import { defineComponentBundle, mergeComponentOptions } from "zaffre";
import { ToDoModel } from "../Model";
import { ToDoRecord } from "../Data";

export interface ToDoItemRowOptions extends BoxOptions {}

defineComponentBundle<ToDoItemRowOptions>("ToDoItemRow", "Box", {
  width: pct(100),
  padding: core.space.s0,
  alignItems: "center",
  justifyContent: "center",
});

export function ToDoItemRow(item: ToDoRecord, model: ToDoModel, inOptions: BV<ToDoItemRowOptions> = {}): View {
  const options = mergeComponentOptions("ToDoItemRow", inOptions);
  const readOnly = atom(true);
  const sharedItemRowState: SharedViewState = {
    hovered: atom(false),
  };
  options.sharedState = sharedItemRowState;
  options.componentName = "ToDoItemRow";
  options.model = [model, item];

  const editor = tableRecordEditor(item, true);
  editor.completed.addAction(() => model.adjustCompletedCount());
  // editor.content.addAction(() => updateRecordFromEditor(editor, item));
  // editor.completed.addAction(() => updateRecordFromEditor(editor, item));

  return restoreOptions(
    HStack(options).append(
      Checkbox(editor.completed, { font: core.font.headline_medium }),
      TextInput(<Atom<string>>editor.content, {
        readOnly: readOnly,
        width: calc("100% - 5em"),
        textDecoration: atom(() => (editor.completed.get() ? "line-through" : "")),
        outlineWhenEdited: true,
        editOnDoubleClick: true,
      }),
      TextButton("x", {
        hidden: atom(() => !sharedItemRowState.hovered?.get()),
        position: "absolute",
        right: em(0.1),
        font: core.font.title_medium,
        action: () => model.deleteRecord(item),
      })
    )
  );
}
