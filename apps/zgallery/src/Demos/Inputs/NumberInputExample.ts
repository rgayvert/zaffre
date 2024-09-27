import { atom, core, View, NumberInput, TextLabel, HStack } from "zaffre";
import { ValueBox } from "./ValueBox";

export function NumberInputExample(): View {
  const number = atom(124, { action: (val) => numberValid.set(val >= 100 && val <= 200) });
  const numberValid = atom(true);
  return ValueBox(
    atom(() => number.get().toString()),
    numberValid, 
    HStack({ gap: core.space.s2 }).append(
      NumberInput(number, {
        border: core.border.thin.color(core.color.blue),
        font: core.font.title_medium,
        min: 100,
        max: 200,
        valid: numberValid,
      }),
      TextLabel("✓", {
        hidden: atom(() => !numberValid.get()),
      })
    )
  );
}
