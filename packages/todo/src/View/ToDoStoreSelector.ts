import { atom, View, RadioButtons } from "zaffre";
import { ToDoModel } from "../Model"; 

export function ToDoStoreSelector(model: ToDoModel): View | undefined {
  const selectedStore = atom("Local", { action: (storeName) => model.changeStore(storeName) });
  const storeNames = ["Local", "Remote"]; 

  if (model.remoteStore()) { 
    return RadioButtons(selectedStore, storeNames, storeNames, {
      flexDirection: "row",
      radioButtonOptions: {
        onIcon: "icon.square-box-filled",
        offIcon: "icon.square-box-outlined",
      },
    });
  } else {
    return undefined;
  }
}
 