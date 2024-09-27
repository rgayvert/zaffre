import { zget, zstring, zutil } from ":foundation";
import { ITheme } from "../AttrTypes";
import { Token, TokenOptions, URLToken } from "../Token";
import { ColorToken } from "../ColorToken";
import { LinearGradientToken } from "./GradientToken";
import { ImageToken } from "./ImageToken";

//
//
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
        //options.image?.formatWithTheme(theme) || "",
        this.formatSubtokenWithTheme(theme, options.url) || "",
        zget(options.position) || "",
        zget(options.size) || "",
        options.repeat || "",
        options.attachment || "",
        options.origin || "",
        options.clip || "",
        this.formatSubtokenWithTheme(theme, options.color) || "",
        //options.color?.formatWithTheme(theme) || "",
      ];
      //console.log(zutil.joinNonEmpty(parts));
      return zutil.joinNonEmpty(parts);
    }
    formatWithTheme(theme: ITheme): string {
      return (Array.isArray(this.options) ? this.options : [this.options]).map((opts) => this.formatOptions(opts, theme)).join(",");
    }
  
  }
  
