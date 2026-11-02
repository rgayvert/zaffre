import { atom, FileInput, arrayAtom, zborder, zfont, zspace } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const FileInputExample = () => {
  const fileNames = arrayAtom<File>([]);
  return InputExampleBox(
    atom(() => fileNames.length === 0 ? "" : fileNames.at(0)?.name || ""),
    undefined,
    FileInput(fileNames, {
      multiple: false,
      padding: zspace.none,
      border: zborder.thin,
      accept: ".jpg, .jpeg, .png",
      label: "Pick an image",
    })
  );
}
