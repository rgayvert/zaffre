import { Atom, ZType } from ":foundation";
import { Color, Font, TonalPalette } from ":uifoundation";

//
// Interface definitions for theme, token, view (AttrTarget)
//
// TODO: rethink Themes and Tokens; can we avoid ITheme & IToken without introducing circular dependencies?
//

export interface ITheme {
  colorForKey(key: string): Color;
  tonalPaletteForKey(key: string): TonalPalette;
  fontForKey(key: string): Font;
  spaceForKey(key: string): string;
  roundingForKey(key: string): string;
  inDarkMode(): boolean;
  useFluidFonts: Atom<boolean>;
  formatFont(font: Font): string;
  registerToken(token?: IToken): void;
  setTarget(target: AttrTarget): void;
  currentColorContractRatio: number;
}
export type ztheme = ZType<ITheme>;

export interface IToken {
  cssKey(): string;
  formatWithTheme(theme: ITheme): string;
}

export type SimpleAttributeValue = string | number | boolean | IToken | undefined;
export type AttributeValue = SimpleAttributeValue | Atom<SimpleAttributeValue>;

export interface Attributes {
  [key: string]: AttributeValue | undefined;
}

export interface AttrTarget {
  theme: ITheme;
  cssID(): string;
  baseStyleName(): string;
  setVClassName(clsName: string): void;
  setProperty(key: string, value: string): void;
  setAttribute(attrName: string, value: string): void;
  removeAttribute(attrName: string): void;
  viewName: string;

  cssAttributes(): Attributes;
  htmlAttributes(): Attributes;
  svgAttributes(): Attributes;
}

