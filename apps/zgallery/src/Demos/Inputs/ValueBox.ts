import { HStack, core, View, LabelBox, TextLabel, Atom, atom } from "zaffre";

export function ValueBox(value: Atom<string>, valid: Atom<boolean> | undefined, ...views: View[]): View {
  let validBox = undefined;
  if (valid) {
    const validString = atom(() => valid?.get() ? "true" : "false");
    validBox = LabelBox("Valid:").append(TextLabel(validString, { font: core.font.label_large }));
  }
  return HStack({ gap: core.space.s7, font: core.font.label_large }).append(
    ...views,
    LabelBox("Value:").append(TextLabel(value, { font: core.font.label_large })),
    validBox
  );
}
