import { TableRecord, atom } from ":foundation";
import { View, core, em, pct } from ":core";
import { Form, FormFieldSpecs, FormOptions } from ":components";
import { TFModel } from "./TFModel";

//
// A TFForm is a Form intended for use in a TableFormView. 
//
// TODO: make this a full reusable component

export function TFForm<R extends TableRecord>(model: TFModel<R>, fields: FormFieldSpecs<R>): View {
  const maxGridCol = Math.max(...Object.values(fields).map((field) => field?.gridArea.c2 || 2)) - 1;
  const formOptions: FormOptions = {
    templateColumns: `repeat(${maxGridCol}, 1fr)`,
    resetLabel: atom(() => (model.selectionIsPersisted() ? "" : "Clear")),
    submitLabel: atom(() => (model.editedRecordIsPersisted() ? "Update" : "Create")),
    cancelAction: () => model.cancelEdit(),
    submitAction: () => model.submitRecord(),
    validationOn: model.validationOn,
    width: pct(90),
  };

  return Form(model.editedRecord, model.editor, fields, formOptions);
}
