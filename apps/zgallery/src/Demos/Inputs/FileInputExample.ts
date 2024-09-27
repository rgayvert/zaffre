import { atom, core, View, FileInput, arrayAtom, px, ch } from "zaffre";
import { ValueBox } from "./ValueBox";

export function FileInputExample(): View {
  const fileNames = arrayAtom<File>([]);
  return ValueBox(
    atom(() => `File<${fileNames.length}>`),
    undefined,
    FileInput(fileNames, {
      multiple: true,
      font: core.font.body_medium,
      border: core.border.thin,
      accept: ".jpg, .jpeg, .png",
      label: "Pick an image",
    })
  );
}
