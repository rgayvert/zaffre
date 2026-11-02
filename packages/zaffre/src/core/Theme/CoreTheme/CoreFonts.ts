import { zutil } from ":foundation";
import { Font } from ":uifoundation";

//
// Definitions of the core font scheme, based on Material 3.
//

type CoreFontUse = "display" | "headline" | "title" | "label" | "body";

type CoreFontSizes = [lineHeight: number, size: number, tracking: number, weight: number];

const fontFromMaterialSizes = (family: string, sizes: CoreFontSizes): Font => {
  const [lineHeight, size, tracking, weight] = sizes;
  return new Font(family, size, "normal", weight, zutil.roundTo(lineHeight / size, 2), tracking);
}

const addCoreFonts = (map: Map<string, Font>, use: CoreFontUse, family: string, large: CoreFontSizes, medium: CoreFontSizes, small: CoreFontSizes): void => {
  map.set(`${use}_large`, fontFromMaterialSizes(family, large));
  map.set(`${use}_medium`, fontFromMaterialSizes(family, medium));
  map.set(`${use}_small`, fontFromMaterialSizes(family, small));
}


export const createCoreFonts = (): Map<string, Font> => {
  const map = new Map<string, Font>;
  addCoreFonts(map, "display", "Inter, sans-serif", [50, 44, 0, 400], [44, 40, 0, 400], [40, 36, 0, 400]);
  addCoreFonts(map, "headline", "Inter, sans-serif", [36, 32, 0, 400], [30, 27, 0, 400], [26, 24, 0, 400]);
  addCoreFonts(map, "title", "Inter, sans-serif", [24, 22, 0, 400], [23, 20, 0.15, 500], [20, 18, 0.1, 500]);
  addCoreFonts(map, "body", "Inter, sans-serif", [22, 16, 0.5, 400], [20, 14, 0.25, 400], [16, 12, 0.4, 400]);
  addCoreFonts(map, "label", "Inter, sans-serif", [14, 12, 0.1, 500], [12, 10, 0.5, 500], [10, 9, 0.5, 500]);
  return map;
}
