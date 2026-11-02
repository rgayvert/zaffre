import { atom, RadioGroup, zspace } from "zaffre";
import { ToDoModel } from "../Model";

export const ToDoDbSelector = (model: ToDoModel) => {
  const selectedDb = atom("Local", { action: (dbName) => model.changeDb(dbName) });
  const storeNames = ["Local", "Remote"];

  if (ToDoModel.remoteURL()) {
    return RadioGroup(selectedDb, storeNames, storeNames, {
      flexDirection: "row",
      gap: zspace.s5,
    });
  } else {
    return undefined;
  }
}
  