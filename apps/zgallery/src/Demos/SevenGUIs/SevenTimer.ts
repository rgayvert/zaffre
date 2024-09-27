import { core, View, CenterBox, Button, VStack, LabelBox, Gauge, TextLabel, Slider, SliderOptions, StackOptions, pct, ch, HStack } from "zaffre";
import { SevenTimerModel } from "./SevenTimerModel";

export function SevenTimer(): View {
    const model = new SevenTimerModel();

  const sliderOptions: SliderOptions = {
    minVal: 0,
    maxVal: 20,
    width: ch(20),
    radiusRatio: 20,
  } as const;
  const stackOptions: StackOptions = {
    border: core.border.thin,
    justifyContent: "center",
    margin: core.space.s6,
    padding: core.space.s6,
    gap: core.space.s5,
  };
 
  return CenterBox().append(
      VStack(stackOptions).append(
        LabelBox("Elapsed Time:").append(Gauge(model.percent)),
        TextLabel(model.elapsedLabel),
        LabelBox("Duration: ").append(Slider(model.duration, sliderOptions)),
        HStack({ gap: core.space.s5, width: pct(100) }).append(
            Button({ label: "Start", action: () => model.reset(), width: pct(40) }),
            Button({ label: "Reset", action: () => model.reset(), width: pct(40) })
        )
      )
  );
}
