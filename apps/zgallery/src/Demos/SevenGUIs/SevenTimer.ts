import { CenterBox, Button, VStack, LabelBox, Gauge, TextLabel, Slider, SliderOptions, StackOptions, pct, ch, HStack, zborder, zspace } from "zaffre";
import { SevenTimerModel } from "./SevenTimerModel";

export const SevenTimer = () => {
    const model = new SevenTimerModel();

  const sliderOptions: SliderOptions = {
    minVal: 0,
    maxVal: 20,
    width: ch(20),
    radiusRatio: 20,
  } as const;
  const stackOptions: StackOptions = {
    border: zborder.thin,
    justifyContent: "center",
    margin: zspace.s6,
    padding: zspace.s6,
    gap: zspace.s5,
  };
 
  return CenterBox().append(
      VStack(stackOptions).append(
        LabelBox("Elapsed Time:").append(Gauge(model.percent)),
        TextLabel(model.elapsedLabel),
        LabelBox("Duration: ").append(Slider(model.duration, sliderOptions)),
        HStack({ gap: zspace.s5, width: pct(100) }).append(
            Button({ label: "Start", action: () => model.reset(), width: pct(40) }),
            Button({ label: "Reset", action: () => model.reset(), width: pct(40) })
        )
      )
  );
}
