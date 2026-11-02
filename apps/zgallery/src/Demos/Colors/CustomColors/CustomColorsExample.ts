import { atom, ch, colorFromHex, VStack, zspace } from "zaffre";
import { ColorSelector, ColorSpaceGrid } from "../Common";

export const CustomColorsExample = () => {

  const currentColor = atom(colorFromHex("#5588ee"));

  return VStack({ gap: zspace.s7, padding: zspace.s6 }).append(
    ColorSelector(currentColor, { storageKey: "customcolors" }),
    ColorSpaceGrid(currentColor, { width: ch(44) }),
  );
}
