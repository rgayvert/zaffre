import { zget, zrect2D, zstring, zutil } from ":foundation";
import { ITheme } from "./AttrTypes";
import { Token, TokenOptions } from "./Token";

//
// Simple token classes, including the following:
//   Literal, Space, Length, Percent, URL, Position, Rect
//

export const css = (s: string): LiteralToken => {
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
export type LengthUnit = "rem" | "em" | "ch" | "px" | "vh" | "vw" | "vmin";

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
 
export const em = (x: number): LengthToken => {
  return new LengthToken(x, "em");
}
export const rem = (x: number): LengthToken => {
  return new LengthToken(x, "rem");
}
export const ch = (x: number): LengthToken => {
  return new LengthToken(x, "ch");
}
export const px = (x: number): LengthToken => {
  return new LengthToken(x, "px");
}
export const pct = (x: number): PercentToken => {
  return new PercentToken(x);
}
export const vh = (x: number): LengthToken => {
  return new LengthToken(x, "vh");
}
export const vw = (x: number): LengthToken => {
  return new LengthToken(x, "vw");
}
export const vmin = (x: number): LengthToken => {
  return new LengthToken(x, "vmin");
}

export const urlToken = (url: zstring): URLToken => {
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

export const createPositionToken = (val1: zstring, val2: zstring): PositionToken => {
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

export const rectToken = (val: zrect2D, delimiter = " "): RectToken => {
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


export const clipToken = (coords: number[]): ClipToken => {
  return new ClipToken(coords);
}
export class ClipToken extends Token {
  constructor(public coords: number[]) {
    super({});
  }
  formatWithTheme(_theme: ITheme): string {
    return `polygon(${zutil.chunk(this.coords.map((c) => `${c * 100}%`), 2).map((pair) => `${pair[0]} ${pair[1]}`).join(",")})`;
  }
}