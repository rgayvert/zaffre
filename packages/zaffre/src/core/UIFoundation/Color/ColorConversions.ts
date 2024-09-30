import { Color, createColor, HSL, LAB, LCH, OKLAB, XYZ } from "./Color";
import { RGB, ZColorSpace } from "./Color";

//
// Routines for converting among color spaces supported in CSS
//

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



function gammaToLinear(c: number): number {
  return c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
}
function linearToGamma(c: number): number {
  return c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
}


// adapted from https://gist.github.com/avisek/eadfbe7a7a169b1001a2d3affc21052e

export function labToLCH([l, a, b]: LAB): LCH {
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

  let h = Math.atan2(b, a); //Quadrant by signs
  if (h > 0) {
    h = (h / Math.PI) * 180;
  } else {
    h = 360 - (Math.abs(h) / Math.PI) * 180;
  }
  return [l, c, h];
}
export function lchToLAB([l, c, h]: LCH): LAB {
  const a = Math.cos(h * 0.01745329251) * c;
  const b = Math.sin(h * 0.01745329251) * c;
  return [l, a, b];
}

export function rgbToLCH(rgb: RGB): LCH {
  return labToLCH(rgbToLAB(rgb));
}
export function lchToRGB(lch: LCH): RGB {
  return labToRGB(lchToLAB(lch));
}

// adapted from https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion

function rgbToXYZ([r, g, b]: RGB): XYZ {
  r = gammaToLinear(r / 255);
  g = gammaToLinear(g / 255);
  b = gammaToLinear(b / 255);
  const x = 100 * (0.4124 * r + 0.3576 * g + 0.1805 * b);
  const y = 100 * (0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = 100 * (0.0193 * r + 0.1192 * g + 0.9505 * b);
  return [x, y, z];
}
function xyzToRGB([x, y, z]: XYZ): RGB {
  x = x / 100;
  y = y / 100;
  z = z / 100;
  const r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const b = x * 0.0557 + y * -0.204 + z * 1.057;
  return [r, g, b].map((n) => (n > 0.0031308 ? 1.055 * Math.pow(n, 1 / 2.4) - 0.055 : 12.92 * n)).map((n) => n * 255) as RGB;
}

function xyzToLAB([x, y, z]: RGB): LAB {
  const D65 = [95.047, 100, 108.883];
  [x, y, z] = [x, y, z].map((v, i) => {
    v = v / D65[i];
    return v > 0.008856 ? Math.pow(v, 1 / 3) : v * 7.787 + 16 / 116;
  });
  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [l, a, b];
}
function labToXYZ([l, a, b]: LAB): XYZ {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;
  [x, y, z] = [x, y, z].map((n) => (Math.pow(n, 3) > 0.008856 ? Math.pow(n, 3) : (n - 16 / 116) / 7.787));
  return [x * 95.047, y * 100.0, z * 108.883];
}
export function rgbToLAB(rgb: RGB): LAB {
  return xyzToLAB(rgbToXYZ(rgb));
}
export function labToRGB(lab: LAB): RGB {
  return xyzToRGB(labToXYZ(lab));
}


// adapted from https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion

function hueToRGBComponent(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

export function hslToRGB([hue, saturation, lightness]: [number, number, number]): RGB {
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  let rgb: RGB;

  if (s === 0) {
    rgb = [l, l, l]; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    rgb = [hueToRGBComponent(p, q, h + 1 / 3), hueToRGBComponent(p, q, h), hueToRGBComponent(p, q, h - 1 / 3)];
  }

  return rgb.map((v) => Math.round(v * 255)) as RGB;
}

export function rgbToHSL([red, green, blue]: [number, number, number]): HSL {
  const [r, g, b] = [red, green, blue].map((v) => v / 255);
  const vmax = Math.max(r, g, b);
  const vmin = Math.min(r, g, b);
  let h = 0;
  const l = (vmax + vmin) / 2;

  if (vmax === vmin) {
    return [0, 0, l]; // achromatic
  }

  const d = vmax - vmin;
  const s = l > 0.5 ? d / (2 - vmax - vmin) : d / (vmax + vmin);
  if (vmax === r) h = (g - b) / d + (g < b ? 6 : 0);
  if (vmax === g) h = (b - r) / d + 2;
  if (vmax === b) h = (r - g) / d + 4;
  h /= 6;

  return [h * 360, s * 100, l * 100];
}





// adapted from https://gist.github.com/earthbound19/e7fe15fdf8ca3ef814750a61bc75b5ce

export function rgbToOklab(rgb: RGB): OKLAB {
  const r = gammaToLinear(rgb[0] / 255);
  const g = gammaToLinear(rgb[1] / 255);
  const b = gammaToLinear(rgb[2] / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    l * +0.2104542553 + m * +0.793617785 + s * -0.0040720468,
    l * +1.9779984951 + m * -2.428592205 + s * +0.4505937099,
    l * +0.0259040371 + m * +0.7827717662 + s * -0.808675766,
  ];
}

export function oklabToSRGB([L, a, bb]: OKLAB): RGB {
  const l = (L + a * +0.3963377774 + bb * +0.2158037573) ** 3;
  const m = (L + a * -0.1055613458 + bb * -0.0638541728) ** 3;
  const s = (L + a * -0.0894841775 + bb * -1.291485548) ** 3;

  const r = Math.round(255 * linearToGamma(l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292));
  const g = Math.round(255 * linearToGamma(l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965));
  const b = Math.round(255 * linearToGamma(l * -0.0041960863 + m * -0.7034186147 + s * +1.707614701));

  return [r, g, b];
}
