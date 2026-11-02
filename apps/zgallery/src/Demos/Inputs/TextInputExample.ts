import { atom, TextInput } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const TextInputExample = () => {
  const textValid = atom(false);
  const textValue = atom("sample");
  return InputExampleBox(
    textValue,
    textValid,
    TextInput(textValue, {
      pattern: "\\w{3,7}",
      required: true,
      valid: textValid,
    })
  );
}
