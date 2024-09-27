import { Theme, coreTheme, Color, CoreKeyColors, CoreThemeOptions } from "zaffre";

export const themeKeyColorValues = {
  blue: { primary: "#0b57d0", secondary: "#8a90a5", tertiary: "#a886a5" },
  green: { primary: "#386a20", secondary: "#87957c", tertiary: "#6b9999" },
  red: { primary: "#9c4146", secondary: "#ad8887", tertiary: "#ac8c5c" },
  lemon: { primary: "#f4ed71", secondary: "#959271", tertiary: "#709986" },
  tropical: { primary: "#d72f01", secondary: "#ae887f", tertiary: "#a28f5b" },
  circus: { primary: "#ff0000", secondary: "#0000ff", tertiary: "#00ff00" },
};
export type galleryThemeKey = keyof typeof themeKeyColorValues;
export const galleryThemeNames = Object.keys(themeKeyColorValues);


export function createGalleryThemeNamed(name: galleryThemeKey, initialColorMode = Theme.defaultColorMode()): Theme {
  const keyColorValues = themeKeyColorValues[name];
  const keyColors: CoreKeyColors = new Map([
    ["primary", Color.fromHex(keyColorValues.primary)],
    ["secondary", Color.fromHex(keyColorValues.secondary)],
    ["tertiary", Color.fromHex(keyColorValues.tertiary)],
  ]);
  const circusTones = {primary: 50, secondary: 50, tertiary: 50, primaryContainer: 80, secondaryContainer: 80, tertiaryContainer: 80};
  const options: CoreThemeOptions = {
    initialColorMode: initialColorMode,
    lightTones: name === "circus" ? circusTones : {},
    darkTones: name === "circus" ? circusTones : {},
  };
  return coreTheme(name, keyColors, options);
}