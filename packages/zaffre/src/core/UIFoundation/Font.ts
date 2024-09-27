import { zutil, lazyinit } from ":foundation";

//
//
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
    public style?: string,
    public weight?: number | string,
    public lineHeight?: number,
    public letterSpacing?: number) {
  }
  scaleBy(factor: number): Font {
    return new Font(this.family, this.size * factor, this.style, this.weight, this.lineHeight, this.letterSpacing);
  }
  withWeight(weight: number): Font {
    return new Font(this.family, this.size, this.style, weight, this.lineHeight, this.letterSpacing);
  }
  withStyle(style: string): Font {
    return new Font(this.family, this.size, style, this.weight, this.lineHeight, this.letterSpacing);
  }
  public withOptions(options: FontOptions): Font {
    const weight = options.weight || this.weight;
    const style = options.style || this.style;
    const scale = options.scale || 1.0;
    return new Font(this.family, this.size * scale, style, weight, this.lineHeight, this.letterSpacing);
  }
  
  toString(): string {
    return this.toStringWithScale(1.0);
  }

  toStringWithScale(scale: number): string {
    const parts = [];
    if (this.style) {
      parts.push(this.style);
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
