import { zutil } from ":foundation";
import { Font } from ":uifoundation";

//
//
//

type CoreFontUse = "display" | "headline" | "title" | "label" | "body";

type CoreFontSizes = [lineHeight: number, size: number, tracking: number, weight: number];

function createFontFromMaterialSizes(family: string, sizes: CoreFontSizes): Font {
  const [lineHeight, size, tracking, weight] = sizes;
  return new Font(family, size, "normal", weight, zutil.roundTo(lineHeight / size, 2), tracking);
}

function addCoreFonts(map: Map<string, Font>, use: CoreFontUse, family: string, large: CoreFontSizes, medium: CoreFontSizes, small: CoreFontSizes): void {
  map.set(`${use}_large`, createFontFromMaterialSizes(family, large));
  map.set(`${use}_medium`, createFontFromMaterialSizes(family, medium));
  map.set(`${use}_small`, createFontFromMaterialSizes(family, small));
}


export function createCoreFonts(): Map<string, Font> {
  const map = new Map<string, Font>;
  addCoreFonts(map, "display", "'Roboto Regular', sans-serif", [64, 57, 0, 400], [52, 45, 0, 400], [44, 36, 0, 400]);
  addCoreFonts(map, "headline", "'Roboto Regular', sans-serif", [40, 32, 0, 400], [36, 28, 0, 400], [32, 24, 0, 400]);
  addCoreFonts(map, "title", "'Roboto Regular', sans-serif", [28, 20, 0, 400], [24, 16, 0.15, 500], [20, 14, 0.1, 500]);
  addCoreFonts(map, "body", "'Roboto Regular', sans-serif", [24, 16, 0.5, 400], [20, 14, 0.25, 400], [16, 12, 0.4, 400]);
  addCoreFonts(map, "label", "'Roboto Regular', sans-serif", [20, 14, 0.1, 500], [16, 12, 0.5, 500], [16, 11, 0.5, 500]);
  return map;
}
