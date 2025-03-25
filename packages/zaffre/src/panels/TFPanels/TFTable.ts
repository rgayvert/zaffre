import { Atom, BasicAction, atom, TableRecord } from ":foundation";
import { View, core, defineComponentBundle, em, mergeComponentOptions, pct, restoreOptions } from ":core";
import { VStack, HStack, Spacer, StackOptions, TextLabel, Table, Button, AlertDialog, TableOptions } from ":components";
import { TFModel } from "./TFModel";

//
// A TFTable is a Table together with a set of action buttons, intended for use in a TableFormView.
//

export interface TFTableOptions extends StackOptions {
  tableOptions?: TableOptions;
  includeControls?: boolean;
}
defineComponentBundle<TFTableOptions>("TFTable", "Stack", {
  justifyContent: "start",
  gap: core.space.s3,
  minHeight: em(15),
});

export function TFTable<R extends TableRecord>(
  model: TFModel<R>,
  inOptions: TFTableOptions = {}
): View {
  const options = mergeComponentOptions("TFTable", inOptions);
  options.model ??= model;
  options.tableOptions ??= {};
  options.tableOptions.doubleClickAction ??= () => model.editSelectedRecord();

  function ActionButton(label: string, action: BasicAction, disabled?: Atom<boolean>): View {
    return Button({
      label: label,
      controlSize: "xs",
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

  function TopControls(): View {
    return HStack({ gap: core.space.s3 }).append(
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
    );
  }
  function TopRow(): View {
    return HStack({ width: pct(100) }).append(
      TextLabel(model.title, { font: core.font.title_small }),
      Spacer(1),
      options.includeControls ? TopControls() : undefined
    );
  }

  return restoreOptions(
    VStack(options).append(
      TopRow(),
      Table(model.tableModel, {
        width: pct(100),
        border: core.border.thin,
        ...options.tableOptions,
      })
    )
  );
}
