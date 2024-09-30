import { znumber } from ":foundation";
import { Token, TokenOptions } from "../Token";
import { LengthToken, PercentToken } from "../SimpleTokens";

import { ITheme } from "../AttrTypes";

//
// A FlexToken contains a description of a CSS flex shorthand property. 
//

export interface FlexTokenOptions extends TokenOptions {
  grow?: znumber;
  shrink?: znumber;
  basis?: LengthToken | PercentToken | "auto" | "content" | "max-content" | "min-content" | "fit-content";
  //basis?: css_flexBasis;
}

export class FlexToken extends Token {

  constructor(public options: FlexTokenOptions) {
    super({});
  }
  public prefix(): string {
    return "flex";
  }
  formatWithTheme(theme: ITheme): string {
    const grow = this.options.grow || 0;
    const shrink = this.options.shrink || 1;
    const basis = this.options.basis || "auto";
    const basisString = basis instanceof Token ? basis.formatWithTheme(theme) : basis;

    return `${grow} ${shrink} ${basisString}`;
  }
}

export function flexToken(options: FlexTokenOptions): FlexToken {
    return new FlexToken(options);
}
