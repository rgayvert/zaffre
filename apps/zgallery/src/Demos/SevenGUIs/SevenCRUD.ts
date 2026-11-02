import { atom, Atom, LabelBox, ListBox, BasicAction,  zspace } from "zaffre";
import { Button, VStack, TextInput, HStack, LabeledList } from "zaffre";
import { SevenCRUDModel } from "./SevenCRUDModel";
import { sevenCrudRules } from "./SevenCRUD.rules";


export const SevenCRUD = () => {
  const model = new SevenCRUDModel();

  const LabeledInput = (label: string, value: Atom<string>) => {
    return LabelBox(label).append(
      TextInput(value)
    );
  }
  const ActionButton = (label: string, action: BasicAction, disabled?: Atom<boolean>) => {
    return Button({ label: label, action: action, disabled: disabled });
  }

  return VStack({ rules: sevenCrudRules, name: "topStack" }).append(
    HStack({ gap: zspace.s7 }).append(
      VStack({ gap: zspace.s5 }).append(
        LabeledInput("Filter prefix:", model.filter),
        ListBox(model.recordList)
      ),
      LabeledList([
        ["Name:", LabeledInput("", model.first)],
        ["Surname:", LabeledInput("", model.last)],
      ])
    ),
    HStack({ gap: zspace.s5, justifyContent: "center" }).append(
      ActionButton(
        "Create",
        () => model.createRecord(),
        atom(() => !model.readyToCreate())
      ),
      ActionButton(
        "Update",
        () => model.updateRecord(),
        atom(() => !model.readyToUpdate())
      ),
      ActionButton(
        "Delete",
        () => model.deleteRecord(),
        atom(() => !model.readyToDelete())
      )
    )
  );
}
