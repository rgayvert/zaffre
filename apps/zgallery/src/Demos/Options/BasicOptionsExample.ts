import { View, core, TextLabel, HStack, TextLabelOptions } from "zaffre";

export function BasicOptionsExample(): View {
  const options: TextLabelOptions = {
    border: core.border.thin,
    font: core.font.headline_small,
    color: core.color.red,  
    padding: core.space.s2,
    background: core.color.primaryContainer 
  };
  return HStack({ gap: core.space.s7, alignItems: "center" }).append(
    TextLabel("Hello, World"),
    TextLabel("Hello, World", options)
  );
}
  