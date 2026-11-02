import { atom, NumberInput, TextLabel, HStack } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const NumberInputExample = () => {
  const number = atom(124, { action: (val) => numberValid.set(val >= 100 && val <= 200) });
  const numberValid = atom(true);
  return InputExampleBox(
    atom(() => number.get().toString()),
    numberValid, 
    HStack({ cls: "input-container" }).append(
      NumberInput(number, {
        min: 100,
        max: 200,
        valid: numberValid,
        extraClasses: "hide-numeric-controls"
      }),
      TextLabel("✓", {
        hidden: () => !numberValid.get(),
      })
    )
  );
}
