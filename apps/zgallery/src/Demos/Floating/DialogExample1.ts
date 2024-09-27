import { Button, AlertDialogOptions, AlertDialog, HStack, View } from "zaffre";
import { core, atom, Atom, BasicAction, TextLabel, pct, ch } from "zaffre";

export function DialogExample1(): View {
  const dialog1Hidden = atom(true);
  const dialog2Hidden = atom(true);
  const dialog3Hidden = atom(true);
  const response = atom("");

  function button(
    label: string,
    title: string,
    defaultAction: BasicAction,
    hideDialog: Atom<boolean>,
    dialogOptions: AlertDialogOptions
  ): View {
    return Button({
      label: label,
      padding: core.space.s3,
      ripple: false,
      action: () => hideDialog.set(false),
    }).append(AlertDialog(hideDialog, title, defaultAction, dialogOptions));
  }
  return HStack({ gap: core.space.s4, width: pct(50), justifyContent: "space-around" }).append(
    button("Simple Alert", "Don't do that.", () => response.set("OK"), dialog1Hidden, {}),
    button("Yes/No", "Are you sure?", () => response.set("Yes"), dialog2Hidden, {
      acceptLabel: "Yes",
      rejectLabel: "No",
      rejectAction: () => response.set("No"),
    }),
    button("Save Changes", "Save your changes?", () => response.set("Save"), dialog3Hidden, {
      acceptLabel: "Save",
      rejectLabel: "Discard",
      rejectAction: () => response.set("Discard"),
      cancelLabel: "Cancel",
      cancelAction: () => response.set("Cancel"),
    }),
    TextLabel(
      atom(() => `Response: ${response.get()}`),
      { font: core.font.label_medium, minWidth: ch(7) }
    )
  );
}
