import { TableFormEnsemble, View } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";
import { demoUserFields } from "./DemoUserFields";
import { DemoUserModel } from "./DemoUserModel";

export function TFEnsembleExample(): View {
  const model = new DemoUserModel();
  return TableFormEnsemble(DemoUserRecord, model.store, model.userTableModel, demoUserFields());
}
