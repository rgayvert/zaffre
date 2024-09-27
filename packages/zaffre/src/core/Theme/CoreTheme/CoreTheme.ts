import { zutil, lazyinit } from ":foundation";
import { Font, Color, ColorMode, TonalPalette } from ":uifoundation";
import { Theme } from "../Theme";
import { createCoreFonts } from "./CoreFonts";
import { createLightCoreColors, createDarkCoreColors, CoreKeyColors, coreFixedColorKeys, coreFixedColors, coreSemanticColorKeys, coreSemanticColors, CoreTones, KeyPalettes } from "./CoreColors";

//
//
//


export interface CoreThemeOptions {
  lightTones?: Partial<CoreTones>;
  darkTones?: Partial<CoreTones>;
  initialColorMode?: ColorMode;
  spaceBase?: number;
  spaceRatio?: number;
  widthBase?: number;
  widthRatio?: number;
}

const blueKeyColors: CoreKeyColors = new Map([
  ["primary", Color.fromHex("#0b57d0")],
  ["secondary", Color.fromHex("#8a90a5")],
  ["tertiary", Color.fromHex("#a886a5")],
]);
export function defaultCoreTheme(): CoreTheme {
  return coreTheme("blue", blueKeyColors);
}

export function coreTheme(name: string, keyColors: CoreKeyColors, options: CoreThemeOptions = {}): CoreTheme {
  return new CoreTheme(name, keyColors, zutil.mergeOptions(CoreTheme.defaultOptions, options));
}

export class CoreTheme extends Theme {

  @lazyinit public static get defaultOptions(): CoreThemeOptions {
    return {
      spaceBase: 2.0,
      spaceRatio: 1.5,
      widthBase: 1.0,
      widthRatio: 1.5,
    };
  }

  @lazyinit public get tonalPalettes(): KeyPalettes {
    return {
      primary: new TonalPalette(this.coreKeyColors.get("primary") || Color.fromHex("#0b57d0")),
      secondary: new TonalPalette(this.coreKeyColors.get("secondary") || Color.fromHex("#8a90a5")),
      tertiary: new TonalPalette(this.coreKeyColors.get("tertiary") || Color.fromHex("#a886a5")),
      neutral: new TonalPalette(this.coreKeyColors.get("neutral") || Color.fromHex("#605D62")),
      error: new TonalPalette(this.coreKeyColors.get("error") || Color.fromHex("#ba1b1b")),
    };
  }

  lightColors: Map<string, Color>;
  darkColors: Map<string, Color>;
  fixedColors: Map<string, Color>;
  semanticColors: Map<string, Color>;

  constructor(public name: string, public coreKeyColors: CoreKeyColors, protected options: CoreThemeOptions = {}) {
    super(name, options.initialColorMode);

    this.lightColors = createLightCoreColors(this.tonalPalettes, options.lightTones || {});
    this.darkColors = createDarkCoreColors(this.tonalPalettes, options.darkTones || {});
    this.fixedColors = coreFixedColors();
    this.semanticColors = coreSemanticColors();
  }

  keyColors(): Map<string, Color> {
    return this.coreKeyColors; 
  }

  colorForKey(key: string): Color {
    return (this.inDarkMode() ? this.darkColors.get(key) : this.lightColors.get(key))  || this.fixedColors.get(key) || this.semanticColors.get(key) || Color.none;
  }
  fixedColorKeys(): string[] {
    return coreFixedColorKeys();
  }  
  semanticColorKeys(): string[] {
    return coreSemanticColorKeys();
  }

  coreFonts = createCoreFonts();
  fontForKey(key: string): Font {
    return this.coreFonts.get(key) || Font.none;
  }

  indexToEm(index: number, base: number, ratio: number): string {
    const val = index === 0 ? 0 : (base * ratio ** (index - 1)).toFixed(2);
    return `${val}em`;
  }

  spaceBase = 0.15;
  spaceRatio = 1.6;
  spaceValues = new Map(zutil.sequence(0, 11).map((s, index) => [`s${s}`, this.indexToEm(index, this.spaceBase, this.spaceRatio)]));

  spaceForKey(key: string): string {
    return this.spaceValues.get(key) || "";
  }

  roundingValues = ["0em", "0.5em", "0.75em", "1em", "1.5em", "2em"];
  
  roundingForKey(key: string): string {
    return key.match(/r[0-5]/) ? this.roundingValues[parseInt(key[1])] : "";
  }

}


