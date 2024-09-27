import { core, View, VStack, TextLabel, ViewList, atom } from "zaffre";
import { Button, HStack } from "zaffre";
import { HelloModel4 } from "./HelloModel4";

export function HelloWorld4(): View {
  const model = new HelloModel4();
  function ValueLabel(value: number): View {
    return TextLabel(`${value}`, {
      font: core.font.title_medium,
      border: core.border.thin,
      padding: core.space.s2,
    });
  }
  return VStack({ gap: core.space.s5 }).append(
    HStack({ gap: core.space.s4, padding: core.space.s4 }).append(
      ViewList(
        model.values,
        (val) => val,
        (val) => ValueLabel(val)
      )
    ),
    HStack({ gap: core.space.s5 }).append(
      Button({ label: "Add", action: () => model.addValue() }),
      Button({ 
        label: "Remove", 
        disabled: atom(() => model.values.length === 1),
        action: () => model.removeValue() 
      })
    )
  );
}
