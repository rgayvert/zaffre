import { core, View, TextLabel, CenterBox, HStack, Button, em } from "zaffre";
import { SevenCounterModel } from "./SevenCounterModel";

export function SevenCounter(): View {
  const model = new SevenCounterModel();
  return CenterBox().append(
    HStack({ gap: core.space.s5 }).append(
      TextLabel(model.count, {
        minWidth: em(3), 
        border: core.border.thin,
        color: core.color.primary,
        font: core.font.body_large,
        padding: core.space.s2,
      }),
      Button({ 
        label: "Count",
        action: () => model.counter.increment()
      })
    )
  );
}
