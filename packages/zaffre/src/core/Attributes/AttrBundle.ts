import { Atom, zget, zutil } from ":foundation";
import { Token, AttrTarget, Attributes, AttributeValue } from "./Tokens";
import { Attr, CSSAttr, SVGAttr, HTMLAttr } from "./Attr";
import { ZStyle } from "./Style";

//
// An AttrBundle gathers up the HTML/CSS/SVG attributes for a View and applies them
// to the view, creating styles where possible. It also holds on to any reactive attributes.
//

export class AttrBundle {
  reactiveAttrs = new Map<string, Attr>();

  cssAttrs(attributes: Attributes): CSSAttr[] {
    return Object.entries(attributes)
      .map(([key, value]) => CSSAttr.create(this.target, zutil.kebabize(key), value || value === 0 ? value : ""))
      .filter((attr) => attr.attrValue instanceof Atom || attr.hasValidValue());
  }

  // convert the value of each reactive target attr to a CSS var; the CSS values for these will be set later
  setReactiveValues(attrs: CSSAttr[]): void {
    attrs.forEach((attr) => (attr.attrValue = `var(--${attr.attrName})`));
  }
  styleFromCSSAttributes(name: string, attributes: Attributes, pseudoName = ""): ZStyle | undefined {
    let style = ZStyle.named(name);
    if (!style) {
      const attrs = this.cssAttrs(attributes);
      if (attrs.length > 0) {
        const reactiveAttrs = attrs.filter((attr) => attr.attrValue instanceof Atom);
        this.setReactiveValues(reactiveAttrs);
        style = ZStyle.create(name, attrs);
      }
    }
    return style;
  }

  // support reactive updates in a DOM inspector
  touchReactiveAttributes(): void {
    this.reactiveAttrs.forEach((attr) => attr.touch());
  }

  constructor(public target: AttrTarget) {
    const cssAttributes = target.cssAttributes();
    const style = this.styleFromCSSAttributes(target.baseStyleName(), cssAttributes);
    if (style) {
      target.setVClassName(style.name);
    }

    this.addHTMLAttributes(target.htmlAttributes());
    this.addCSSAttributes(cssAttributes);
    this.addSVGAttributes(target.svgAttributes());
  }

  add(attr: Attr): void {
    if (attr.attrValue instanceof Atom) {
      this.reactiveAttrs.set(attr.attrName, attr);
    }
  }

  getAttrValue(attrName: string): string {
    const val = zget(this.reactiveAttrs.get(attrName));
    return val || val === 0 ? val.toString() : "";
  }

  private addAttributes(
    attrs: Attributes,
    createAttrFn: (target: AttrTarget, attrName: string, attrVal: AttributeValue) => Attr
  ): void {
    Object.entries(attrs)
      .filter(([_attrName, attrValue]) => attrValue !== undefined)
      .forEach(([attrName, attrValue]) => {
        this.add(createAttrFn(this.target, attrName, attrValue));
      });
  }

  private addCSSAttributes(attrs: Attributes = {}): void {
    this.addAttributes(attrs, CSSAttr.create);
  }
  private addHTMLAttributes(attrs: Attributes = {}): void {
    this.addAttributes(attrs, HTMLAttr.create);
  }
  private addSVGAttributes(attrs: Attributes = {}): void {
    this.addAttributes(attrs, SVGAttr.create);
  }

  debugAttribute(attrName: string, b = true): void {
    const attr = this.reactiveAttrs.get(attrName);
    if (attr) {
      attr.debug = b;
    }
  }
  apply(): void {
    this.reactiveAttrs.forEach((targetAttr) => targetAttr.apply());
  }

  formatValue(value: AttributeValue | undefined): string {
    const val = zget(value) || "";
    return val instanceof Token ? val.formatForAttributeValue(this.target.theme) : val.toString();
  }
}
