import { core, View, pct, TextLabel, HStack, SVGEffect } from "zaffre";

export function TextLabelExample(): View {
  return HStack({ width: pct(100), gap: core.space.s5 }).append(
      TextLabel("Plain Label", {}),
      TextLabel("Filled Label", { background: core.color.teal, padding: core.space.s2 }),
      TextLabel("Outlined Label", {
        border: core.border.thin,
        color: core.color.blue,
        padding: core.space.s3,
        effects: { clicked: SVGEffect.ripple() },
      }),
  
  );
}
