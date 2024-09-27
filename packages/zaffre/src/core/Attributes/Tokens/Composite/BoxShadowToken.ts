import { zboolean, zutil } from ":foundation";
import { Token, LengthToken, TokenOptions } from "../Token";
import { ColorToken } from "../ColorToken";
import { ITheme } from "../AttrTypes";

//
//
//

export interface BoxShadowTokenOptions extends TokenOptions {
    color?: ColorToken;
    inset?: zboolean;
    offsetX?: LengthToken;
    offsetY?: LengthToken;
    blurRadius?: LengthToken;
    spreadRadius?: LengthToken;
  }

  export function boxShadowToken(options: BoxShadowTokenOptions): BoxShadowToken {
    return new BoxShadowToken(options);
  }
  
  export class BoxShadowToken extends Token {
    public prefix(): string {
      return "boxshadow";
    }
    constructor(public options: BoxShadowTokenOptions) { //  | BoxShadowTokenOptions[]) {
      super({});
    }
    formatOptions(options: BoxShadowTokenOptions, theme: ITheme): string {
      const parts: string[] = [
        options.inset ? "inset" : "",
        options.color?.formatWithTheme(theme) || "",
        options.offsetX?.formatWithTheme(theme) || "",
        options.offsetY?.formatWithTheme(theme) || "",
        options.blurRadius?.formatWithTheme(theme) || "",
        options.spreadRadius?.formatWithTheme(theme) || "",
      ];
      return zutil.joinNonEmpty(parts);
    }
    formatWithTheme(theme: ITheme): string {
      return (Array.isArray(this.options) ? this.options : [this.options]).map((opts) => this.formatOptions(opts, theme)).join(",");
    }
  }
  

  