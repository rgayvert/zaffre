import { ITheme } from "./AttrTypes";

//
// Base class for tokens. This defines the standard interaction with a theme.
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
