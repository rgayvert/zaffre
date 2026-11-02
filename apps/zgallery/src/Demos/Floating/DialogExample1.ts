import { Button, HStack, NoticeDialog, YesNoDialog, Dialog, showDialog } from "zaffre";
import { YesNoCancelDialog, zfont, zrounding, zspace, PromptDialog } from "zaffre";
import { atom, TextLabel, pct, ch } from "zaffre";

export const DialogExample1 = () => {
  const response = atom("");

  const promptModel = {
    label: "Enter something: ",
    value: atom(""),
  };

  const ActionButton = (label: string, dialog: Dialog) => {
    return Button({
      label: label,
      padding: zspace.s3,
      rounding: zrounding.pill,
      action: () => showDialog(dialog),
    });
  };
  const simpleAlert: Dialog = (hidden) =>
    NoticeDialog(hidden, "Don't do that.", {
      acceptLabel: "OK",
      acceptAction: () => response.set("OK"),
    });

  const yesNo: Dialog = (hidden) =>
    YesNoDialog(hidden, "Are you sure?", {
      acceptLabel: "Yes",
      acceptAction: () => response.set("Yes"),
      rejectLabel: "No",
      rejectAction: () => response.set("No"),
    });

  const saveChanges: Dialog = (hidden) =>
    YesNoCancelDialog(hidden, "Save changes?", {
      acceptLabel: "Save",
      acceptAction: () => response.set("Save"),
      rejectLabel: "Discard",
      rejectAction: () => response.set("Discard"),
      cancelLabel: "Cancel",
      cancelAction: () => response.set("Cancel"),
    });
  const prompt: Dialog = (hidden) =>
    PromptDialog(promptModel, hidden, {
      acceptLabel: "OK",
      acceptAction: () => response.set(promptModel.value.get()),
      acceptDisabled: atom(() => !promptModel.value.get()),
      cancelLabel: "Cancel",
      cancelAction: () => response.set("prompt canceled"),
    });

  return HStack({ gap: zspace.s4, width: pct(50), justifyContent: "space-around" }).append(
    ActionButton("Simple Alert", simpleAlert),
    ActionButton("Yes/No", yesNo),
    ActionButton("Save Changes", saveChanges),
    ActionButton("Prompt", prompt),
    TextLabel(
      atom(() => `Response: ${response.get()}`),
      { font: zfont.label_large, minWidth: ch(7) },
    ),
  );
};
