import { TextLabel, VStack, zfont } from "zaffre";

export const StandardFontsExample = () => {
  const uses = ["display", "headline", "title", "body", "label"] as const;
  const sizes = ["large", "medium", "small"] as const;
  const fonts = uses
    .map((use) => sizes.map((size) => ({ name: `${use}_${size}`, font: zfont[`${use}_${size}`] })).flat())
    .flat();
  return VStack({ alignItems: "start" }).append(...fonts.map(({ name, font }) => TextLabel(name, { font: font })));
}
