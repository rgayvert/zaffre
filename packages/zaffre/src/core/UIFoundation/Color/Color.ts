import { zutil, lazyinit } from ":foundation";

//
// A Color represents a color value in one of the color spaces supported in CSS, along with an alpha value.
//

export type ZColorSpace = "rgb" | "lch" | "lab" | "hsl" | "oklab";

export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];
export type XYZ = [number, number, number];
export type LAB = [number, number, number];
export type OKLAB = [number, number, number];
export type LCH = [number, number, number];
export type HSL = [number, number, number];

// functions to convert a color to CSS format

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

export function colorFromHex(hex: string): Color {
  const rgba = hexToRGBA(hex);
  const a = rgba[3] === undefined ? 255 : rgba[3];
  return colorRGB(rgba[0], rgba[1], rgba[2], zutil.clamp(a / 255, 0, 1));
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

  constructor(public colorSpace: ZColorSpace, public comp: number[], public alpha = 1.0) {}

  toCSS(): string {
    return cssMap.get(this.colorSpace)?.(this) || this.toString();
  }
  asHex(): string {
    return `#${this.comp.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  withOpacity(alpha: number): Color {
    return new Color(this.colorSpace, this.comp, alpha);
  }
}

export enum ColorMode {
  light = "light",
  dark = "dark",
}

