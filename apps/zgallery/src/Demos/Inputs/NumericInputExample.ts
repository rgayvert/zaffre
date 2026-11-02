import { atom, NumberInput, TextLabel, HStack, NumericInput, ch } from "zaffre";
import { InputExampleBox } from "./InputExampleBox";

export const NumericInputExample = () => {
  const number = atom(124, { action: (val) => numberValid.set(val >= 100 && val <= 200) });
  const numberValid = atom(true);
  return InputExampleBox(
    atom(() => number.get().toString()),
    numberValid, 
    HStack({ cls: "input-container" }).append(
      NumericInput(number, {
        min: 100,
        max: 200,
        valid: numberValid,
        width: ch(10)
      }),
    )
  );
}
