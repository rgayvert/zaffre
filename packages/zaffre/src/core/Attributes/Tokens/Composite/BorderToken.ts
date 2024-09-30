import { Token, TokenOptions } from "../Token";
import { LengthToken } from "../SimpleTokens";
import { ColorToken } from "../ColorToken";
import { ITheme } from "../AttrTypes";

//
// A BorderToken is intended to handle the shorthand CSS border property.
//

export type CSSBorderStyle = "none" | "dotted" | "inset" | "dashed" | "solid" | "double" | "groove" | "ridge" | "outset";

export interface BorderTokenOptions extends TokenOptions {
  width?: LengthToken;
  style?: CSSBorderStyle;
  color?: ColorToken;
}

export function borderToken(options: BorderTokenOptions): BorderToken {
  return new BorderToken(options);
}
export class BorderToken extends Token {

  constructor(public options: BorderTokenOptions = {}) {
    super(options);
  }
  public prefix(): string {
    return "border";
  }
  formatTokenWithTheme(theme: ITheme, token?: Token): string | undefined {
    return token && token.hasCSSVar() ? token.cssValue() : token ? token.formatWithTheme(theme) : undefined;
  }
  formatWithTheme(theme: ITheme): string {
    if (this.key === "none") {
      return "none";
    }
    const w = this.formatSubtokenWithTheme(theme, this.options.width);
    const c = this.formatSubtokenWithTheme(theme, this.options.color);
    
    return `${w} ${this.options.style || "solid"} ${c}`;
  }
  isBorderToken(): boolean {
    return true;
  }
  color(color: ColorToken): BorderToken {
    return borderToken({
      ...this.options,
      key: "",
      color: color
    });
  }
  width(width: LengthToken): BorderToken {
    return borderToken({
      ...this.options,
      key: "",
      width: width
    });
  }
  style(style: CSSBorderStyle): BorderToken {
    return borderToken({
      ...this.options,
      key: "",
      style: style
    });
  }

}
