import { atom, core, View, TextInput } from "zaffre";
import { ValueBox } from "./ValueBox";

export function TextInputExample(): View {
  const text = atom("sample");
  const textValid = atom(false);
  return ValueBox(
    text,
    textValid,
    TextInput(text, {
      border: core.border.thin,
      borderColor: atom(() => textValid.get() ? undefined : core.color.red),
      font: core.font.title_medium,
      valid: textValid,
      pattern: "\\w{3,7}",
      required: true
    })
  );
}
