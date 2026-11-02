import { zutil, lazyinit } from ":foundation";

//
// A Font is an object that can be converted to a valid CSS font string.
//

export interface FontOptions {
  weight?: number;
  style?: "normal" | "italic" | "oblique";
  scale?: number;
}

export class Font {

  @lazyinit public static get none(): Font {
    return new Font("sans-serif", 12);
  }

  constructor(
    public family: string,
    public size: number,
    public fontStyle?: string,
    public weight?: number | string,
    public lineHeight?: number,
    public letterSpacing?: number) {
  }
  scaleBy(factor: number): Font {
    return new Font(this.family, this.size * factor, this.fontStyle, this.weight, this.lineHeight, this.letterSpacing);
  }
  withWeight(weight: number): Font {
    return new Font(this.family, this.size, this.fontStyle, weight, this.lineHeight, this.letterSpacing);
  }
  withFontStyle(fontStyle: string): Font {
    return new Font(this.family, this.size, fontStyle, this.weight, this.lineHeight, this.letterSpacing);
  }
  public withOptions(options: FontOptions): Font {
    const weight = options.weight || this.weight;
    const fontStyle = options.style || this.fontStyle;
    const scale = options.scale || 1.0;
    return new Font(this.family, this.size * scale, fontStyle, weight, this.lineHeight, this.letterSpacing);
  }
  
  toString(): string {
    return this.toStringWithScale(1.0);
  }

  toStringWithScale(scale: number): string {
    const parts = [];
    if (this.fontStyle) {
      parts.push(this.fontStyle);
    }
    if (this.weight) {
      parts.push(this.weight.toString());
    }
    const sz = zutil.roundTo(this.size * scale, 2);
    if (this.lineHeight) {
      parts.push(`${sz}px/${this.lineHeight}`);
    } else {
      parts.push(`${sz}px`);
    }
    parts.push(this.family);
    return parts.join(" ");
  }
}
