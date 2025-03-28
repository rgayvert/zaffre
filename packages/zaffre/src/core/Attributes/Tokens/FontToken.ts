import { Font } from ":uifoundation";
import { ITheme } from "./AttrTypes";
import { Token, TokenOptions } from "./Token";

//
// A FontToken contains a description of a font which gets translated
// into a valid CSS font by a theme.
//

type FontStyle = "normal" | "italic" | "oblique";

interface FontTokenOptions extends TokenOptions {
  weight?: number;
  style?: FontStyle;
  scale?: number;
  name?: string;
  size?: number;
}

export function fontToken(options: FontTokenOptions): FontToken {
  return new FontToken(options);
}
export function customFont(options: FontTokenOptions): FontToken {
  return fontToken({ ...options, key: "custom" });
}
export class FontToken extends Token {
  constructor(public options: FontTokenOptions) {
    super(options);
  }

  public prefix(): string {
    return "font";
  }
  public bold(): FontToken {
    return this.weight(700);
  }
  public light(): FontToken {
    return this.weight(100);
  }
  public weight(w: number): FontToken {
    return fontToken({
      ...this.options,
      weight: w,
    });
  }
  public scale(scale: number): FontToken {
    return fontToken({
      ...this.options,
      scale: scale,
    });
  }
  public style(style: FontStyle): FontToken {
    return fontToken({
      ...this.options,
      style: style,
    });
  }
  public italic(): FontToken {
    return this.style("italic");
  }
  isStandard(): boolean {
    return !this.options.weight && !this.options.style && !this.options.scale;
  }
  public hasCSSVar(): boolean {
    return this.key !== "custom" && this.isStandard();
  }
  formatNonStandard(font: Font, theme: ITheme): string {
    const options = {
      weight: this.options.weight,
      style: this.options.style,
      scale: this.options.scale,
    };
    return theme.formatFont(font.withOptions(options));
  }
  formatWithTheme(theme: ITheme): string {
    const font = theme.fontForKey(this.key);
    if (this.key === "inherit") {
      return "inherit";
    } else if (this.key === "custom") {
      return `${this.options.size || "14"}px ${this.options.name || ""}`;
    } else if (!this.isStandard()) {
      return this.formatNonStandard(font, theme);
    } else if (font === Font.none) {
      return "";
    } else {
      return theme.formatFont(font);
    }
  }
}
