import { TableFormEnsemble, TFModel, View } from "zaffre";
import { DemoUserRecord } from "./DemoUserRecord";
import { demoUserFields } from "./DemoUserFields";
import { DemoUserModel } from "./DemoUserModel";

export function TFEnsembleExample(): View {
  const userModel = new DemoUserModel();
  const tfModel = new TFModel(DemoUserRecord, userModel.db.user, userModel.userTableModel, demoUserFields, "Users");

  return TableFormEnsemble(tfModel);
}
