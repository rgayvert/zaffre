import { atom, colorFromHex, relativeLuminance, zutil, colorToken, Color, colorRGB, convertColor, colorLCH, colorHSL } from "zaffre";

/*
contrast = (L1 + 0.05) / (L2 + 0.05)
ranges from 1:1 (no contrast at all) to 21:1

WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text, 
while WCAG Level AAA requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text. 
*/

// create a tone by setting the Lightness component of an HSL color
function hslTone(inColor: Color, tone: number): Color {
    const hsl = convertColor(inColor, "hsl");
    return convertColor(colorHSL(hsl.comp[0], hsl.comp[1], tone), "rgb");
  }
function computeContrast(color1: Color, color2: Color): number {
  const lum1 = relativeLuminance(color1);
  const lum2 = relativeLuminance(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

export class ContrastingColorsModel {
  bgColor = atom(colorFromHex("#8388ee"));
  fgColor = atom(colorFromHex("#888888"));
  bgToken = atom(() => colorToken({ color: this.bgColor.get() }));
  fgToken = atom(() => colorToken({ color: this.fgColor.get() }));
  contrast = atom(() => computeContrast(this.bgColor.get(), this.fgColor.get()));
  text = atom(() => `Contrast: ${zutil.printRoundedTo(this.contrast.get(), 2)} : 1`);
  targetContrast = atom("7 : 1");
  targetRatio = atom(() => parseFloat(this.targetContrast.get().slice(0, -3)));
  targetChoices = zutil.sequence(0, 20).map((i) => `${2 + i * 0.5} : 1`);
  disableAdjust = atom(() => this.contrast.get() >= this.targetRatio.get());
  white = colorRGB(255, 255, 255);
  black = colorRGB(0, 0, 0);

  // find a tone of the given color s.t. the contrast with a fixedColor is at least the desired ratio
  findTone(color: Color, fixedColor: Color, targetRatio: number): Color | undefined {
    const contrasts = zutil
      .sequence(0, 101)
      .map((i) => [i, computeContrast(hslTone(color, i), fixedColor) - targetRatio])
      .filter((x) => x[1] >= 0);
    contrasts.sort((a, b) => a[1] - b[1]);
    return contrasts.length > 0 ? hslTone(color, contrasts[0][0]) : undefined;
  }

  adjustBackground(): void {
    const newColor = this.findTone(this.bgColor.get(), this.fgColor.get(), this.targetRatio.get());
    newColor && this.bgColor.set(newColor);
  }
  adjustForeground(): void {
    const newColor = this.findTone(this.fgColor.get(), this.bgColor.get(), this.targetRatio.get());
    newColor && this.fgColor.set(newColor);
  }
}
