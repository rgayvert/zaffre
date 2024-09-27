import { zget, zrect2D, zstring, zutil } from ":foundation";
import { ITheme } from "./AttrTypes";

//
//
//

export interface TokenOptions {
  key?: string;
  extension?: string;
}

export abstract class Token {

  abstract formatWithTheme(theme: ITheme): string;

  toString(): string {
    return `${this.constructor.name}[${this.cssKey()}}]`;
  }

  // If we have a css var, the value is "var(--[fullkey])"; otherwise, it's a CSS expression
  formatForAttributeValue(theme: ITheme): string {
    if (this.hasCSSVar()) {
      theme.registerToken(this);
      return this.cssValue();
    } else {
      return this.formatWithTheme(theme);
    }
  }

  key: string;

  constructor(public options: TokenOptions = {}) {
    this.key = this.options.key || "";
  }

  public prefix(): string {
    return "";
  }
  public hasCSSVar(): boolean {
    return Boolean(this.options.key);
  }

  // concatenate the prefix, key, extension and replace awkward characters with a dash
  public cssKey(): string {
    return `--${this.prefix()}-${this.key}${this.options.extension || ""}`.replaceAll(/\.|_/g, "-");
  }

  public cssValue(): string {
    return `var(${this.cssKey()})`;
  }

  formatSubtokenWithTheme(theme: ITheme, token?: Token): string | undefined {
    theme.registerToken(token);
    return token && token.hasCSSVar() ? token.cssValue() : token ? token.formatWithTheme(theme) : undefined;
  }
}

export function css(s: string): LiteralToken {
  return new LiteralToken(s);
}

export class LiteralToken extends Token {
  constructor(public value: string) {
    super({});
  } 
  formatWithTheme(_theme: ITheme): string {
    return this.value;
  }
  cssValue(): string {
    return this.value;
  }
}



export class SpaceToken extends Token {
  constructor(public options: TokenOptions = {}) {
    super(options);
  }
  public prefix(): string {
    return "space";
  }
  formatWithTheme(theme: ITheme): string {
    return theme.spaceForKey(this.key);
  }
}
export type LengthUnit = "em" | "ch" | "px" | "vh" | "vw" | "vmin";

export class LengthToken extends Token {

  constructor(public value: number, public unit: LengthUnit) {
    super({});
  }

  public prefix(): string {
    return "length";
  }
  cssValue(): string {
    return this.toString();
  }
  formatWithTheme(_theme: ITheme): string {
    return this.toString();
  }
  toString(): string {
    return `${this.value}${this.unit}`;
  }
}


export class PercentToken extends Token {
  constructor(public value: number) {
    super({});
  }
  public prefix(): string {
    return "pct";
  }
  formatWithTheme(_theme: ITheme): string {
    return `${zutil.roundTo(this.value, 2)}%`;
  }
}

export function em(x: number): LengthToken {
  return new LengthToken(x, "em"); 
}
export function ch(x: number): LengthToken {
  return new LengthToken(x, "ch");
}
export function px(x: number): LengthToken {
  return new LengthToken(x, "px");
}
export function pct(x: number): PercentToken {
  return new PercentToken(x); 
}
export function vh(x: number): LengthToken {
  return new LengthToken(x, "vh");
}
export function vw(x: number): LengthToken {
  return new LengthToken(x, "vw");
}
export function vmin(x: number): LengthToken {
  return new LengthToken(x, "vmin");
}



export function urlToken(url: zstring): URLToken {
  return new URLToken(url);
}

export class URLToken extends Token {
  constructor(public url: zstring) {
    super({});
  }
  public prefix(): string {
    return "url";
  }
  formatWithTheme(_theme: ITheme): string {
    return `url(${zget(this.url)})`;
  }
}

// TODO

export function createPositionToken(val1: zstring, val2: zstring): PositionToken {
  return new PositionToken(val1, val2);
}

export class PositionToken extends Token {
  constructor(public val1: zstring, val2: zstring) {
    super({});
  }
  public prefix(): string {
    return "position";
  }
  formatWithTheme(_theme: ITheme): string {
    return ``;
  }
}

export function rectToken(val: zrect2D, delimiter = " "): RectToken {
  return new RectToken(val, delimiter);
}
export class RectToken extends Token {
  constructor(public val: zrect2D, public delimiter: string) {
    super({});
  }
  public prefix(): string {
    return "rect";
  }
  formatWithTheme(_theme: ITheme): string {
    return zget(this.val).asDelimitedList(this.delimiter);
  }
}