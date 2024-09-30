import { zutil } from ":foundation";
import { colorHSL, Color } from "./Color";
import { convertColor } from "./ColorConversions";

//
// Routines to calculate contrast between two colors, and to find a contrasting color with a specified ratio.
//

export function relativeLuminance(color: Color): number {
  const rgbColor = convertColor(color, "rgb");
  const [r, g, b] = rgbColor.comp
    .map((c) => c / 255)
    .map((c) => (c < 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hslTone(inColor: Color, tone: number): Color {
  const hsl = convertColor(inColor, "hsl");
  return convertColor(colorHSL(hsl.comp[0], hsl.comp[1], tone), "rgb");
}
function computeContrast(color1: Color, color2: Color): number {
  const lum1 = relativeLuminance(color1);
  const lum2 = relativeLuminance(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

export function findContrastingTone(color: Color, fixedColor: Color, targetRatio: number): Color | undefined {
  const contrasts = zutil
    .sequence(0, 101)
    .map((i) => [i, computeContrast(hslTone(color, i), fixedColor) - targetRatio])
    .filter((x) => x[1] >= 0);
  contrasts.sort((a, b) => a[1] - b[1]);
  return contrasts.length > 0 ? hslTone(color, contrasts[0][0]) : undefined;
}
