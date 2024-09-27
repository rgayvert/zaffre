import { atom, ch, core, colorFromHex, VStack, View } from "zaffre";
import { ColorSpaceGrid } from "./ColorSpaceGrid";
import { ColorSelector } from "./ColorSelector";

export function CustomColorsExample(): View {

  const currentColor = atom(colorFromHex("#5588ee"));

  return VStack({ gap: core.space.s7, padding: core.space.s6 }).append(
    ColorSelector(currentColor, "customcolors"),
    ColorSpaceGrid(currentColor, { width: ch(44) }),
  );
}
