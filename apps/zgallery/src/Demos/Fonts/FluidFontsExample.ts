import { LabelBox, Spacer, Switch, TextLabel, Theme, VStack, View, atom, core, windowWidth, zutil } from "zaffre";

export function FluidFontsExample(): View {
  const windowSize = atom(() => windowWidth().toString());
  const fontSize = atom(() => zutil.printRoundedTo(Theme.default.scaledFontSize(core.font.headline_large), 2));
  const labelOptions = { font: core.font.body_large };
  return VStack({ alignItems: "center" }).append(
    LabelBox("Fluid Fonts: ").append(Switch(Theme.default.useFluidFonts, { controlSize: "xs" })),
    Spacer(core.space.s5),
    TextLabel("headline_large", { font: core.font.headline_large }),
    LabelBox("window width:", labelOptions).append(TextLabel(windowSize)),
    LabelBox("var(--font-headline-large):", labelOptions).append(TextLabel(fontSize))
  );
}
