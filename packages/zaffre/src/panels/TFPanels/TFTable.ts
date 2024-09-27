import { Atom, BasicAction, atom, TableRecord } from ":foundation";
import { View, core, em, pct } from ":core";
import { VStack, HStack, Spacer, StackOptions, TextLabel, Table, Button, AlertDialog } from ":components";
import { TFModel } from "./TFModel";

//
// A TFTable is a Table together with a set of action buttons, intended for use in a TableFormView. 
//

export function TFTable<R extends TableRecord>(model: TFModel<R>): View {
  function ActionButton(label: string, action: BasicAction, disabled?: Atom<boolean>): View {
    return Button({
      label: label,
      controlSize: "sm",
      rounding: core.rounding.pill,
      action: action,
      disabled: disabled,
    });
  }
  const hideDeleteDialog = atom(true);
  function DeletionAlertDialog(): View {
    return AlertDialog(hideDeleteDialog, "Are you sure?", () => model.deleteRecord(), {
      acceptLabel: "Yes",
      rejectLabel: "No",
    });
  }

  function TopRow(): View {
    return HStack({ width: pct(100) }).append(
      TextLabel("Users", { font: core.font.title_large }),
      Spacer(1),
      HStack({ gap: core.space.s3 }).append(
        ActionButton("Add", () => model.newRecord()),
        ActionButton(
          "Edit",
          () => model.editSelectedRecord(),
          atom(() => !model.hasSelection())
        ),
        ActionButton(
          "Delete",
          () => hideDeleteDialog.set(false),
          atom(() => !model.hasSelection())
        ).append(DeletionAlertDialog())
      )
    );
  }

  const stackOptions: StackOptions = {
    model: model,
    justifyContent: "start",
    gap: core.space.s3,
    minHeight: em(15),
    name: "TFTable",
  };
  return VStack(stackOptions).append(
    TopRow(),
    Table(model.tableModel, {
      width: pct(100),
      border: core.border.thin,
      doubleClickAction: () => model.editSelectedRecord(),
    })
  );
}
