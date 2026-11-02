import { TextLabel, CenterBox, HStack, Button, em, zcolor, zborder, zfont, zspace } from "zaffre";
import { SevenCounterModel } from "./SevenCounterModel";

export const SevenCounter = () => {
  const model = new SevenCounterModel();
  return CenterBox().append(
    HStack({ gap: zspace.s5 }).append(
      TextLabel(model.count, {
        minWidth: em(3), 
        border: zborder.thin,
        color: zcolor.primary,
        font: zfont.body_large,
        padding: zspace.s2,
      }),
      Button({ 
        label: "Count",
        action: () => model.counter.increment()
      })
    )
  );
}
