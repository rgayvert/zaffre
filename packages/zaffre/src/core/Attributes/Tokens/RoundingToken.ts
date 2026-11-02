import { ITheme } from "./AttrTypes";
import { Token } from "./Token";

//
// A RoundingToken contains a description of a font which gets translated
// into a valid CSS rounding value by a theme.
//

export class RoundingToken extends Token {

  public prefix(): string {
    return "rounding";
  }

  formatWithTheme(theme: ITheme): string {
    if (this.key === "pill") {
      return "100em";
    } else if (this.key === "circle") {
      return "50%";
    } else if (this.key === "inherit") {
      return "inherit";
    } else if (this.key === "none") {
      return "";
    } else {
      return theme.roundingForKey(this.key);
    }
  }
}
