import { ClassConstructor, TableRecord, TableStore, TableModel } from ":foundation";
import { View } from ":core";
import { Ensemble, FormFieldSpecs } from ":components";
import { TFModel } from "./TFModel";
import { TFForm } from "./TFForm";
import { TFTable } from "./TFTable";

//
// A TableFormEnsemble is a panel which toggles between a table view and a form view. 
//

export function TableFormEnsemble<R extends TableRecord>(
  recordClass: ClassConstructor<R>,
  store: TableStore<R>,
  tableModel: TableModel<R>,
  fields: FormFieldSpecs<R>
): View {
  const model = new TFModel(recordClass, store, tableModel);

  return Ensemble(model.currentView, (key: string) => (key === "table" ? TFTable(model) : TFForm(model, fields)));
}
