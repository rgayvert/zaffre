import { ClassConstructor, TableRecord, TableStore, TableModel } from ":foundation";
import { defineComponentBundle, mergeComponentOptions, restoreOptions, View } from ":core";
import { Ensemble, EnsembleOptions, FormFieldSpecFn, FormOptions, TableOptions } from ":components";
import { TFModel } from "./TFModel";
import { TFForm } from "./TFForm";
import { TFTable, TFTableOptions } from "./TFTable";

//
// A TableFormEnsemble is a panel which toggles between a table view and a form view.
//

export interface TableFormEnsembleOptions extends EnsembleOptions {
  tableOptions?: TableOptions;
  formOptions?: FormOptions;
  includeControls?: boolean;
}
defineComponentBundle<TableFormEnsembleOptions>("TableFormEnsemble", "Ensemble", {
  includeControls: true
});

export function TableFormEnsemble<R extends TableRecord>(
  model: TFModel<R>,
  inOptions: TableFormEnsembleOptions = {},
): View {
  const options = mergeComponentOptions("TableFormEnsemble", inOptions);
  options.model = model;
  const tfTableOptions: TFTableOptions = { 
    tableOptions: options.tableOptions,
    includeControls: options.includeControls
  };

  function FormEnsemble(): View {
    return Ensemble(model.editedRecordID, () => TFForm(model,options.formOptions), { mode: "single" });
  }

  return restoreOptions(
    Ensemble(model.currentView, (key: string) => (key === "table" ? TFTable(model, tfTableOptions) : FormEnsemble()), options)
  );
}
