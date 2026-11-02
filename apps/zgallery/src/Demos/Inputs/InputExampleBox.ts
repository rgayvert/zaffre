import { View, LabelBox, TextLabel, Atom, atom, Grid, HStack, pct } from "zaffre";
import { inputExampleBoxRules } from "./InputExampleBox.rules";

export const InputExampleBox = (value: Atom<string>, valid?: Atom<boolean>, inputView?: View) => {
  let validBox = undefined;
  if (valid) {
    const validString = atom(() => (valid.get() ? "true" : "false"));
    validBox = LabelBox("Valid:").append(TextLabel(validString));
  }
  return Grid({ rules: inputExampleBoxRules }).append(
    inputView,
    HStack({ width: pct(100) }).append(LabelBox("Value:").append(TextLabel(value))), 
    validBox
  );
};
