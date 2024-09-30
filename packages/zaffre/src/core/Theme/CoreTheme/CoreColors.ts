import { Color, TonalPalette } from ":uifoundation";

//
// Definitions of the core color scheme, based on Material 3.
//

export const keyCoreColorNames = ["primary", "secondary", "tertiary", "neutral", "error"] as const;
export type keyCoreColorName = (typeof keyCoreColorNames)[number];
export type CoreKeyColors = Map<Partial<keyCoreColorName>, Color>;
export type KeyPalettes = Record<keyCoreColorName, TonalPalette>;

const coreContainerNames = ["primaryContainer", "secondaryContainer", "tertiaryContainer", "errorContainer"];
const otherNames = ["primary", "secondary", "tertiary", "error", "background", "outline", "surface", "shadow", "scrim"];
const coreColorNames = [...coreContainerNames, ...otherNames] as const;
type coreColorName = (typeof coreColorNames)[number];

export type CoreTones = Record<coreColorName, number>;

export function tonalPalettes(keyColors: CoreKeyColors): KeyPalettes {
  return {
    primary: new TonalPalette(keyColors.get("primary") || Color.fromHex("#0b57d0")),
    secondary: new TonalPalette(keyColors.get("secondary") || Color.fromHex("#8a90a5")),
    tertiary: new TonalPalette(keyColors.get("tertiary") || Color.fromHex("#a886a5")),
    neutral: new TonalPalette(keyColors.get("neutral") || Color.fromHex("#605D62")),
    error: new TonalPalette(keyColors.get("error") || Color.fromHex("#ba1b1b")),
  };
}

const semanticColors = new Map([
  ["success", Color.fromHex("#198754")],
  ["info", Color.fromHex("#0dcaf0")],
  ["warning", Color.fromHex("#ffc107")],
  ["danger", Color.fromHex("#dc3545")],
]);
const fixedColors = new Map([
  ["black", Color.fromHex("#000000")],
  ["white", Color.fromHex("#ffffff")],
  ["none", Color.fromHex("#000000")],
  ["transparent", Color.fromHex("#00000000")],

  ["blue", Color.fromHex("#0d6efd")],
  ["cyan", Color.fromHex("#0dcaf0")],
  ["green", Color.fromHex("#198754")],
  ["indigo", Color.fromHex("#6610f2")],
  ["orange", Color.fromHex("#fd7e14")],
  ["pink", Color.fromHex("#d63384")],
  ["purple", Color.fromHex("#6f42c1")],
  ["red", Color.fromHex("#dc3545")],
  ["teal", Color.fromHex("#20c997")],
  ["yellow", Color.fromHex("#ffc107")],
  ["zaffre", Color.fromHex("#0014a8")],

  ["gray", Color.fromHex("#6c757d")],
  ["lightgray", Color.fromHex("#e9ecef")],
  ["darkgray", Color.fromHex("#343a40")],
]);

export function coreSemanticColors(): Map<string, Color> {
  return semanticColors;
}
export function coreSemanticColorKeys(): string[] {
  return Array.from(semanticColors.keys());
}
export function coreFixedColors(): Map<string, Color> {
  return fixedColors;
}
export function coreFixedColorKeys(): string[] {
  return Array.from(fixedColors.keys());
}

const standardLightTones: CoreTones = {
  primary: 40,
  primaryContainer: 90,
  secondary: 40,
  secondaryContainer: 90,
  tertiary: 40,
  tertiaryContainer: 90,
  error: 40,
  errorContainer: 90,
  background: 99,
  surface: 99,
  outline: 50,
  shadow: 0,
  scrim: 0,
};
const standardDarkTones: CoreTones = {
  primary: 80,
  primaryContainer: 20,
  secondary: 80,
  secondaryContainer: 20,
  tertiary: 80,
  tertiaryContainer: 20,
  error: 80,
  errorContainer: 10,
  background: 10,
  surface: 10,
  outline: 60,
  shadow: 0,
  scrim: 0,
};
const keyPaletteNames: Record<coreColorName, keyCoreColorName> = {
  primary: "primary",
  primaryContainer: "primary",
  secondary: "secondary",
  secondaryContainer: "secondary",
  tertiary: "tertiary",
  tertiaryContainer: "tertiary",
  error: "error",
  errorContainer: "error",
  background: "neutral",
  surface: "neutral",
  outline: "neutral",
  shadow: "neutral",
  scrim: "neutral",
} as const;

function createCoreColors(tonalPalettes: KeyPalettes, tones: CoreTones): Map<string, Color> {
  const map = new Map<string, Color>();
  coreColorNames.forEach((colorName) => {
    map.set(colorName, tonalPalettes[keyPaletteNames[colorName]].tone(tones[colorName]));
  });
  return map;
}

export function createLightCoreColors(tonalPalettes: KeyPalettes, lightTones: Partial<CoreTones>): Map<string, Color> {
  const tones = Object.assign({ ...standardLightTones}, lightTones);
  return createCoreColors(tonalPalettes, tones);
}
export function createDarkCoreColors(tonalPalettes: KeyPalettes, darkTones: Partial<CoreTones>): Map<string, Color> {
  const tones = Object.assign({ ...standardDarkTones}, darkTones);
  return createCoreColors(tonalPalettes, tones);
}
