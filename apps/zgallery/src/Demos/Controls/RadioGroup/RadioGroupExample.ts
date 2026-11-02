import { HStack, RadioGroup, atom, Spacer, TextLabel } from "zaffre";
import { radioGroupExampleRules } from "./RadioGroupExample.rules";

export const RadioGroupExample = () => {

  const radioValue1 = atom("A");
  const radioValue2 = atom("E");
  const result = atom(() => `Value 1: ${radioValue1.get()}<br>Value 2: ${radioValue2.get()}`);

  return HStack({ rules: radioGroupExampleRules }).append(
    RadioGroup(radioValue1, ["A", "B"], ["Option A", "Option B"]),
    RadioGroup(radioValue2, ["D", "E", "F"], ["DDD", "EEE", "FFF"], { cls: "radio2" }),
    Spacer("s7"),
    TextLabel(result)
  );
}
 