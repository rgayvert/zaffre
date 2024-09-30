import { zget, zstring, zutil } from ":foundation";
import { ITheme } from "../AttrTypes";
import { Token, TokenOptions } from "../Token";
import { URLToken } from "../SimpleTokens";
import { ColorToken } from "../ColorToken";
import { LinearGradientToken } from "./GradientToken";
import { ImageToken } from "./ImageToken";

//
// A BackgroundToken is intended to handle the shorthand CSS background property.
// In the simplest case, this is just a color; it can also be an image, a gradient, 
// or URL. 
//
// Note that a css_background attribute type is defined as 
//     css_background = CSSOption<ColorToken | BackgroundToken | GradientToken>;
//
// A BackgroundToken is a composite that is intended to handle these more complex cases.
//

export interface BackgroundTokenOptions extends TokenOptions {
    color?: ColorToken;
    image?: ImageToken | LinearGradientToken;
    url?: URLToken;
    position?: zstring;
    size?: zstring;
    repeat?: "repeat-x" | "repeat-y" | "repeat" | "space" | "round" | "no-repeat";
    origin?: "border-box" | "padding-box" | "content-box";
    attachment?: "scroll" | "fixed" | "local";
    blendMode?: zstring;
    clip?: "border-box" | "padding-box" | "content-box" | "text";
  }


  export function backgroundToken(options: BackgroundTokenOptions): BackgroundToken {
    return new BackgroundToken(options);
  }
  
  export class BackgroundToken extends Token {
  
    public prefix(): string {
      return "background";
    }
    constructor(public options: BackgroundTokenOptions) {   // | BackgroundOptions[]) {
      super({});
    }
    formatOptions(options: BackgroundTokenOptions, theme: ITheme): string {
      const parts: string[] = [
        this.formatSubtokenWithTheme(theme, options.image) || "",
        this.formatSubtokenWithTheme(theme, options.url) || "",
        zget(options.position) || "",
        zget(options.size) || "",
        options.repeat || "",
        options.attachment || "",
        options.origin || "",
        options.clip || "",
        this.formatSubtokenWithTheme(theme, options.color) || "",
      ];
      return zutil.joinNonEmpty(parts);
    }
    formatWithTheme(theme: ITheme): string {
      return (Array.isArray(this.options) ? this.options : [this.options]).map((opts) => this.formatOptions(opts, theme)).join(",");
    }
  
  }
  
