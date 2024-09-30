import { Color, colorOKLAB } from "./Color";
import { convertColor } from "./ColorConversions";

//
// Mixing colors
//

export class ZColorMix extends Color {
  constructor(public color: Color, public mixColor: Color, public mixPct = 50) {
    mixColor.alpha = color.alpha;
    super(color.colorSpace, color.comp);
  }
  toCSS(): string {
    return `color-mix(in oklab, ${this.color.toCSS()}, ${this.mixColor.toCSS()} ${this.mixPct}%)`;
  }
}

export function colorMix(color: Color, tone: number, black: Color, white: Color): Color {
  const color2 = tone < 50 ? black : white;
  const pct = tone < 50 ? (50 - tone) * 2 : (tone - 50) * 2;
  const a1 = 1.0 - pct / 100;
  const a2 = pct / 100;
  const ok1 = convertColor(color, "oklab");
  const ok2 = convertColor(color2, "oklab");
  const comp = [0, 1, 2].map((i) => a1 * ok1.comp[i] + a2 * ok2.comp[i]);
  const ok3 = colorOKLAB(comp[0], comp[1], comp[2], 1.0);
  return tone === 50 ? color : convertColor(ok3, "rgb");
}
