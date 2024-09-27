import { TextLabel, VStack, View, core } from "zaffre";

export function StandardFontsExample(): View {
  const uses = ["display", "headline", "title", "body", "label"] as const;
  const sizes = ["large", "medium", "small"] as const;
  const fonts = uses
    .map((use) => sizes.map((size) => ({ name: `${use}_${size}`, font: core.font[`${use}_${size}`] })).flat())
    .flat();
  return VStack({ alignItems: "start" }).append(...fonts.map(({ name, font }) => TextLabel(name, { font: font })));
}
