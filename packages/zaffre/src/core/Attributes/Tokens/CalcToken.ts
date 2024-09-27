import { ZWindow } from ":uifoundation";
import { ITheme } from "./AttrTypes";
import { Token } from "./Token";

//
//
//

type CalcOption = "add" | "sub" | "mult" | "div";
type CalcValue = Token | string | number;

export class CalcToken extends Token {
  public prefix(): string {
    return "calc";
  }
  operator(): string {
    switch (this.operation) {
      case "add":
        return "+";
      case "sub":
        return "-";
      case "mult":
        return "*";
      case "div":
        return "/";
      default:
        return "";
    }
  }
  formatWithTheme(theme: ITheme): string {
    const s1 = this.val1 instanceof Token ? this.val1.formatWithTheme(theme) : this.val1.toString();
    if (!this.operator || this.val2 === undefined) {
      return `calc(${s1})`;
    }
    const s2 = this.val2 instanceof Token ? this.val2.formatWithTheme(theme) : this.val2.toString();
    return `calc(${s1} ${this.operator()} ${s2})`;
  }
  constructor(protected val1: CalcValue, protected val2?: CalcValue, protected operation?: CalcOption) {
    super({});
  }
}

export function tadd(val1: CalcValue, val2: CalcValue): CalcToken {
  return new CalcToken(val1, val2, "add");
}
export function tsub(val1: CalcValue, val2: CalcValue): CalcToken {
  return new CalcToken(val1, val2, "sub");
}
export function tmult(val1: CalcValue, val2: CalcValue): CalcToken {
  return new CalcToken(val1, val2, "mult");
}
export function tdiv(val1: CalcValue, val2: CalcValue): CalcToken {
  return new CalcToken(val1, val2, "div");
}

export function calc(val1: CalcValue, val2?: CalcValue, operation?: CalcOption): CalcToken {
  return new CalcToken(val1, val2, operation);
}

export function fractionOfWindowSize(fraction: number): CalcToken {
  const sz = ZWindow.windowSizeAtom().get();
  return calc(`${Math.min(sz.width, sz.height) * fraction}px`);
}