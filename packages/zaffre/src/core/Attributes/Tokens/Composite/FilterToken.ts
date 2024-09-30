import { Atom, atom, zget, znumber, zutil } from ":foundation";
import { ITheme } from "../AttrTypes";
import { LengthToken, LiteralToken, PercentToken } from "../SimpleTokens";
import { Token } from "../Token";

import { ColorToken } from "../ColorToken";

//
// A FilterToken contains a description of a CSS filter. 
//

export class FilterToken extends Token {
  constructor(public formatter: (theme: ITheme) => string) {
    super({});
  }
  formatWithTheme(theme: ITheme): string {
    return this.formatter(theme);
  }
}

export type AngleUnits = "deg" | "rad" | "turn";
export type ColorOrLiteral = ColorToken | LiteralToken;

export function format_percent_number(value: znumber | PercentToken, theme: ITheme): string | undefined {
  const val = zget(value);
  return val instanceof Token ? val.formatWithTheme(theme) : val ? zutil.roundTo(val, 2).toString() : undefined;
}

// TODO: generalize this so that we can have a fully reactive FilterToken
export function filterToken(brightness: znumber, blur: znumber): Atom<FilterToken> {
  return atom(
    () =>
      new FilterToken(() => `brightness(${zutil.roundTo(zget(brightness), 2)}) blur(${zutil.roundTo(zget(blur), 2)}px)`)
  );
}

export function css_blur(radius: LengthToken): FilterToken {
  return new FilterToken((theme) => `blur(${radius.formatWithTheme(theme)})`);
}
export function css_brightness(amount: znumber | PercentToken): FilterToken {
  return new FilterToken((theme) => `brightness(${format_percent_number(amount, theme)})`);
}
export function css_contrast(amount: number | PercentToken): FilterToken {
  return new FilterToken((theme) => `contrast(${format_percent_number(amount, theme)})`);
}
function dropShadowArgs(
  theme: ITheme,
  color: ColorOrLiteral,
  offsetX: LengthToken,
  offsetY: LengthToken,
  stdDev?: LengthToken
): string {
  return zutil.joinNonEmpty([
    color.formatWithTheme(theme),
    offsetX.formatWithTheme(theme),
    offsetY.formatWithTheme(theme),
    stdDev?.formatWithTheme(theme),
  ]);
}
export function dropShadowFilter(
  color: ColorOrLiteral,
  offsetX: LengthToken,
  offsetY: LengthToken,
  stdDev?: LengthToken
): FilterToken {
  return new FilterToken((theme) => `drop-shadow(${dropShadowArgs(theme, color, offsetX, offsetY, stdDev)})`);
}
export function grayscaleFilter(amount: number | PercentToken): FilterToken {
  return new FilterToken((theme) => `grayscale(${format_percent_number(amount, theme)})`);
}
export function hueRotationFilter(angle: number, units: AngleUnits = "deg"): FilterToken {
  return new FilterToken((theme) => `hue-rotate(${angle}${units})`);
}
export function inversionFilter(amount: number | PercentToken): FilterToken {
  return new FilterToken((theme) => `invert(${format_percent_number(amount, theme)})`);
}
export function opacityFilter(amount: number | PercentToken): FilterToken {
  return new FilterToken((theme) => `opacity(${format_percent_number(amount, theme)})`);
}
export function saturationFilter(amount: number | PercentToken): FilterToken {
  return new FilterToken((theme) => `saturate(${format_percent_number(amount, theme)})`);
}
export function sepiaFilter(amount: number | PercentToken): FilterToken {
  return new FilterToken((theme) => `sepia(${format_percent_number(amount, theme)})`);
}
