import { zget, ZType, zstring, zutil } from ":foundation";
import { ITheme } from "../AttrTypes";
import { Token, TokenOptions } from "../Token";
import { ColorToken } from "../ColorToken";

//
// An ImageToken contains a description of a CSS image.
//

export interface ImageTokenOptions extends TokenOptions {
    tag?: "ltr" | "rtl";
    src?: zstring;
    color?: ZType<ColorToken>;
    region?: zstring;
  }
  
  export class ImageToken extends Token {
    public prefix(): string {
      return "image";
    }
    constructor(public options: ImageTokenOptions) {
      super({});
    }
    formatWithTheme(theme: ITheme): string {
      let src = zget(this.options.src) || "";
      if (this.options.region) {
        src += `#${this.options.region}`;
      }
      const parts: string[] = [
        this.options.tag || "",
        src,
        zget(this.options.color)?.formatWithTheme(theme) || "",
      ];
      return `image(${zutil.joinNonEmpty(parts)})`;
    }
  }
  
  export function imageToken(options: ImageTokenOptions): ImageToken {
    return new ImageToken(options);
  }
  