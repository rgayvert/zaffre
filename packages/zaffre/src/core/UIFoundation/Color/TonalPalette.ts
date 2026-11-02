import { Color, colorRGB } from "./Color";
import { colorMix } from "./ColorMix";

//
// A TonalPalette is a range of colors derived from a single color, ranging from white to black.
//

export type TonalPaletteType = "colormix" | "lab" | "lch" | "hsl" | "hcl";

type ToneFn = (color: Color, tone: number, black: Color, white: Color) => Color;

export class TonalPalette {
  white = colorRGB(255, 255, 255);
  black = colorRGB(0, 0, 0);

  constructor(public color: Color, public toneFn: ToneFn = colorMix) {}

  tone(tone: number): Color {
    return this.toneFn(this.color, tone, this.black, this.white);
  }
}
