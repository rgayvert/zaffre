import { zutil } from ":foundation";
import { Token, TokenOptions } from "../Token";
import { css, LiteralToken } from "../SimpleTokens";  
import { ColorToken } from "../ColorToken"; 
import { ITheme } from "../AttrTypes";
 
//
// A GradientToken contains a description of a CSS gradient. Currently only linear
// gradient are implemented.
//
// TODO: add radial, conic, repeating gradient types.
//

export type ColorSpace = "rgb" | "hsl" | "hwb" | "lab" | "lch" | "oklab" | " oklch" | "light-dark";
export type SideOrCorner =
  | "left"
  | "right"
  | "top"
  | "bottom"
  | "left top"
  | "left bottom"
  | "right"
  | "right top"
  | "right bottom";

export interface LinearGradientOptions extends TokenOptions {
  angle?: number; // in degrees
  to?: SideOrCorner;
  startColor?: ColorToken | LiteralToken;
  endColor?: ColorToken | LiteralToken;
  stopPoints?: number[]; // in pct
  stopColors?: (ColorToken | LiteralToken)[];
}

export function linearGradient(options: LinearGradientOptions): LinearGradientToken {
  return new LinearGradientToken(options);
}

export abstract class GradientToken extends Token {}
export class LinearGradientToken extends GradientToken {
  stopPoints: number[] = [];
  stopColors: (ColorToken | LiteralToken)[] = [];
  direction = "";

  constructor(public options: LinearGradientOptions) {
    super({});
    this.normalize();
  }
  // convert the given options into a standard form
  normalize(): void {
    if (!this.options.angle && !this.options.to) {
      this.direction = "to bottom";
    } else if (this.options.to) {
      this.direction = `to ${this.options.to}`;
    } else {
      this.direction = `${this.options.angle}deg`;
    }
    this.options.startColor ??= css("white");
    this.options.endColor ??= css("black");

    this.stopPoints = this.options.stopPoints || [];
    this.stopColors = this.options.stopColors || [];
    const n = this.stopColors.length;
    if (n > 0 && n !== this.stopPoints.length) {
      // use equally spaced stop points
      this.stopPoints = this.stopColors.map((_color, index) => zutil.roundTo((100 * (index + 1)) / (n + 1), 2));
    }
  }

  formatWithTheme(theme: ITheme): string {
    const start = this.options.startColor?.formatForAttributeValue(theme);
    const end = this.options.endColor?.formatForAttributeValue(theme);
    const mid = this.stopColors?.map(
      (col, index) => `${col.formatForAttributeValue(theme)} ${this.stopPoints[index]}%`
    );
    return zutil.joinNonEmpty([`linear-gradient(${this.direction}`, start, ...mid, `${end})`], ", ");
  }
}

export function gradientX(startColor: ColorToken, endColor: ColorToken): LinearGradientToken {
  return linearGradient({ to: "right", startColor: startColor, endColor: endColor });
}

export function gradientY(startColor: ColorToken, endColor: ColorToken): LinearGradientToken {
  return linearGradient({ to: "bottom", startColor: startColor, endColor: endColor });
}

export function gradientAngle(
  startColor: ColorToken,
  endColor: ColorToken,
  angleInDegrees: number
): LinearGradientToken {
  return linearGradient({ angle: angleInDegrees, startColor: startColor, endColor: endColor });
}

