import { zutil, lazyinit } from ":foundation";
import { HSL, LAB, LCH, OKLAB, RGB, RGBA, hslToRGB, labToRGB, lchToRGB, oklabToSRGB, rgbToHSL, rgbToLAB, rgbToLCH, rgbToOklab } from "./ColorConversions";

//
//
//

export type ZColorSpace = "rgb" | "lch" | "lab" | "hsl" | "oklab";

export enum ColorMode {
  light = "light",
  dark = "dark",
}

const r2 = (num: number): string => zutil.printRoundedTo(num, 2);
const p2 = (num: number): string => `${r2(num)}%`;
type colorFormatter = (color: Color) => string;
const clamp = zutil.clamp;

const rgbToCSS = (color: Color): string => `rgb(${color.comp.map((c) => r2(c)).join(" ")} / ${r2(color.alpha)})`;
const lchToCSS = (color: Color): string => `lch(${[p2(color.comp[0]), p2(color.comp[1]), r2(color.comp[2])].join(" ")} / ${r2(color.alpha)})`;
const labToCSS = (color: Color): string => `lab(${[p2(color.comp[0]), r2(color.comp[1]), r2(color.comp[2])].join(" ")} / ${r2(color.alpha)})`;
const hslToCSS = (color: Color): string => `hsl(${[r2(color.comp[0]), p2(color.comp[1]), p2(color.comp[2])].join(" ")} / ${r2(color.alpha)})`;
const oklabToCSS = (color: Color): string => `oklab(${[r2(color.comp[0]), r2(color.comp[1]), r2(color.comp[2])].join(" ")} / ${r2(color.alpha)})`;

const cssMap = new Map<ZColorSpace, colorFormatter>([
  ["rgb", rgbToCSS],
  ["lch", lchToCSS],
  ["lab", labToCSS],
  ["hsl", hslToCSS],
  ["oklab", oklabToCSS],
]);

export function createColor(colorSpace: ZColorSpace, comp: number[], alpha = 1.0): Color {
  return new Color(colorSpace, comp, alpha);
}
export function colorRGB(red: number, green: number, blue: number, alpha = 1.0): Color {
  return createColor("rgb", [clamp(red, 0, 255), clamp(green, 0, 255), clamp(blue, 0, 255)], alpha);
}
export function colorLCH(lightnessPct: number, chromaPct: number, hue: number, alpha = 1.0): Color {
  return createColor("lch", [clamp(lightnessPct, 0, 100), clamp(chromaPct, 0, 100), clamp(hue, 0, 360)], alpha);
}
export function colorLAB(lightnessPct: number, a: number, b: number, alpha = 1.0): Color {
  return createColor("lab", [clamp(lightnessPct, 0, 100), clamp(a, -125, 125), clamp(b, -125, 125)], alpha);
}
export function colorHSL(hue: number, saturationPct: number, lightnessPct: number, alpha = 1.0): Color {
  return createColor("hsl", [clamp(hue, 0, 360), clamp(saturationPct, 0, 100), clamp(lightnessPct, 0, 100)], alpha);
}
export function colorOKLAB(lightness: number, a: number, b: number, alpha = 1.0): Color {
  return createColor("oklab", [clamp(lightness, 0, 1.0), clamp(a, -0.4, 0.4), clamp(b, -0.4, 0.4)], alpha);
}

export class Color {
  public static rgb([red, blue, green]: RGB): Color {
    return createColor("rgb", [red, blue, green]);
  }
  public static fromHex(hex: string): Color {
    const comp = hexToRGBA(hex);
    const alpha = comp[3] === undefined ? 1.0 : comp[3];
    return new Color("rgb", comp.slice(0, 3), alpha);
  }
  @lazyinit public static get none(): Color {
    return this.fromHex("#000000");
  }
  @lazyinit public static get black(): Color {
    return this.fromHex("#000000");
  }
  @lazyinit public static get white(): Color {
    return this.fromHex("#ffffff");
  }

  palette?: TonalPalette;

  constructor(public colorSpace: ZColorSpace, public comp: number[], public alpha = 1.0) {}

  toCSS(): string {
    return cssMap.get(this.colorSpace)?.(this) || this.toString();
  }
  asHex(): string {
    return rgbToHex(convertColor(this, "rgb").comp as RGB);
  }
  withOpacity(alpha: number): Color {
    return new Color(this.colorSpace, this.comp, alpha);
  }
  tone(tone: number): Color {
    return this.palette?.tone(tone) || this;
  }
}

export class ZColorMix extends Color {
  constructor(public color: Color, public mixColor: Color, public mixPct = 50) {
    mixColor.alpha = color.alpha;
    super(color.colorSpace, color.comp);
  }
  toCSS(): string {
    return `color-mix(in oklab, ${this.color.toCSS()}, ${this.mixColor.toCSS()} ${this.mixPct}%)`;
  }
}

export type TonalPaletteType = "colormix" | "lab" | "lch" | "hsl" | "hcl";

type ToneFn = (color: Color, tone: number, black: Color, white: Color) => Color;

function colorMix(color: Color, tone: number, black: Color, white: Color): Color {
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

export function relativeLuminance(color: Color): number {
  const rgbColor = convertColor(color, "rgb");
  const [r, g, b] = rgbColor.comp.map((c) => c / 255).map((c) => (c < 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
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

export class TonalPalette {
  white = colorRGB(255, 255, 255);
  black = colorRGB(0, 0, 0);

  constructor(public color: Color, public toneFn: ToneFn = colorMix) {}
  tone(tone: number): Color {
    const color = this.toneFn(this.color, tone, this.black, this.white);
    color.palette = this;
    return color;
  }
}

export function hexToRGBA(hex: string, defaultAlpha = 255): RGBA {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  // RRGGBB
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    // RRGGBBAA
    result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  }
  if (!result) {
    return [0, 0, 0, 0];
  } else {
    const r = result.slice(1).map((x) => parseInt(x, 16));
    return (r.length === 4 ? r : [...r, defaultAlpha]) as RGBA;
  }
}
export function rgbToHex(rgba: RGB | RGBA): string {
  return "#" + rgba.map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function colorFromHex(hex: string, space: ZColorSpace = "rgb"): Color {
  const rgba = hexToRGBA(hex);
  const a = rgba[3] === undefined ? 255 : rgba[3];
  return convertColor(colorRGB(rgba[0], rgba[1], rgba[2], zutil.clamp(a / 255, 0, 1)), space);
}
export function convertColorToRGB(color: Color): Color {
  const comp = color.comp;
  let newComp;
  switch (color.colorSpace) {
    case "rgb":
      newComp = comp;
      break;
    case "lch":
      newComp = lchToRGB(comp as LCH);
      break;
    case "lab":
      newComp = labToRGB(comp as LAB);
      break;
    case "hsl":
      newComp = hslToRGB(comp as HSL);
      break;
    case "oklab":
      newComp = oklabToSRGB(comp as OKLAB);
      break;
  }
  return createColor(
    "rgb",
    newComp.map((c) => Math.floor(c)),
    color.alpha
  );
}
export function convertColor(color: Color, space: ZColorSpace): Color {
  const rgbColor = convertColorToRGB(color);
  const comp = rgbColor.comp as RGB;
  let newComp;
  switch (space) {
    case "rgb":
      newComp = comp;
      break;
    case "lch":
      newComp = rgbToLCH(comp);
      break;
    case "lab":
      newComp = rgbToLAB(comp);
      break;
    case "hsl":
      newComp = rgbToHSL(comp);
      break;
    case "oklab":
      newComp = rgbToOklab(comp);
      break;
  }
  return createColor(space, newComp, color.alpha);
}
