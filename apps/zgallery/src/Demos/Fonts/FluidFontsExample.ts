import { LabelBox, Spacer, Switch, TextLabel, Theme, VStack, atom, windowWidth, zfont, zspace, zutil } from "zaffre";

export const FluidFontsExample = () => {
  const windowSize = atom(() => windowWidth().toString());
  const fontSize = atom(() => zutil.printRoundedTo(Theme.default.scaledFontSize(zfont.headline_large), 2));
  const labelOptions = { font: zfont.body_large };
  return VStack({ alignItems: "center" }).append(
    LabelBox("Fluid Fonts: ").append(Switch(Theme.default.useFluidFonts, { controlSize: "xs" })),
    Spacer("s5"),
    TextLabel("headline_large", { font: zfont.headline_large }),
    LabelBox("window width:", labelOptions).append(TextLabel(windowSize)),
    LabelBox("var(--font-headline-large):", labelOptions).append(TextLabel(fontSize))
  );
};
