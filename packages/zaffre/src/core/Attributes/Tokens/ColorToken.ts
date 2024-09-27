import { Color, findContrastingTone, relativeLuminance } from ":uifoundation";
import { ITheme } from "./AttrTypes";
import { Token, TokenOptions } from "./Token";

//
//
//

export interface ColorTokenOptions extends TokenOptions {
    rgba?: string;
    cssName?: string;
    opacity?: number;
    contrast?: boolean;
    color?: Color;
    tone?: number;
}

export function colorToken(options: ColorTokenOptions): ColorToken {
  return new ColorToken(options);
}

export class ColorToken extends Token {

  constructor(public options: ColorTokenOptions) {
    super(options);
    // TODO: fix rgba handling
    if (this.options.rgba && this.options.rgba.length >= 8) {
      this.options.opacity = parseInt(this.options.rgba.slice(-2), 16) / 255;
    } else {
      this.options.opacity ??= 1.0;
    }
  }
  public prefix(): string {
    return "color";
  }

  public opacity(opacity: number): ColorToken {
    return colorToken({
      ...this.options,
      extension: `-o${Math.floor(opacity * 100)}`,
      opacity: opacity
    });
  }
  public get contrast(): ColorToken {
    return colorToken({
      ...this.options,
      contrast: true,
      extension: "-contrast",
    });
  }
  public tone(tone: number): ColorToken {
    return colorToken({
      ...this.options,
      extension: `-t${Math.floor(tone * 100)}`,
      tone: tone
    });
  }

  simpleColorWithTheme(theme: ITheme): Color {
    return this.key ? theme.colorForKey(this.key) : Color.fromHex(this.options.rgba || "");
  }

  contrastingColorWithTheme(theme: ITheme): Color {
    if (this.key === "transparent") {
      return Color.black;
    }
    const baseColor = this.simpleColorWithTheme(theme);
    const lum = relativeLuminance(baseColor);
    const fixedColor = lum < 0.1 ? Color.white : Color.black;
    return findContrastingTone(fixedColor, baseColor, theme.currentColorContractRatio) || fixedColor;
  }

  alphaColorWithTheme(theme: ITheme): Color {
    const baseColor = this.simpleColorWithTheme(theme);
    return baseColor ? baseColor.withOpacity(this.options.opacity || 1.0) : Color.none;
  }
  tonalColor(theme: ITheme): Color {
    const baseColor = this.simpleColorWithTheme(theme);
    return baseColor.tone(this.options.tone || 50);
  }

  colorWithTheme(theme: ITheme): Color {
    if (this.options.contrast) {
      return this.contrastingColorWithTheme(theme);
    } else if (this.options.opacity !== 1) {
      return this.alphaColorWithTheme(theme);
    } else if (this.options.rgba) {
      return Color.fromHex(this.options.rgba);
    } else if (this.options.tone) {
      return this.tonalColor(theme);
    } else {
      return theme.colorForKey(this.key);
    }
  }

  formatWithTheme(theme: ITheme): string {
    if (this.options.color) {
      return this.options.color.toCSS();
    } else if (this.options.cssName) {
      return this.options.cssName;
    } else if (this.key === "none") {
      return "";
    } else if (this.key === "inherit") {
      return "inherit";
    } else {
      return this.colorWithTheme(theme).toCSS();
    }
  }
}

// export function contrastingColor(color: ColorToken): ColorToken {
//   const col = zget(color);
//   const token = typeof col === "string" ? new ColorToken(col) : col;
//   return token.contrast();
// }
