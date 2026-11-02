import { HStack, Slider, TextLabel, atom } from "zaffre";
import { sliderExampleRules } from "./SliderExample.rules";

export const SliderExample = () => {
  const sliderValue = atom(50, { action: () => label.set(sliderValue.get().toFixed(0).toString()) });
  const label = atom("50");

  return HStack({ rules: sliderExampleRules }).append(
    Slider(sliderValue),
    TextLabel(label)
  );
}
