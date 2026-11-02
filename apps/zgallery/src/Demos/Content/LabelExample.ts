import { pct, TextLabel, HStack, SVGEffect, zcolor, zborder, zspace } from "zaffre";

export const LabelExample = () => {
  return HStack({ width: pct(100), gap: zspace.s5 }).append(
      TextLabel("Plain TextLabel", {}),
      TextLabel("Filled TextLabel", { background: zcolor.teal, padding: zspace.s2 }),
      TextLabel("Outlined TextLabel", {
        border: zborder.thin,
        color: zcolor.blue,
        padding: zspace.s3,
        effects: { clicked: SVGEffect.ripple() },
      }),
  
  );
}
