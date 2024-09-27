import { zget, zutil, zlog, Atom, performAction, ReactiveAction, reactiveAction } from ":foundation";
import { Token } from "./Tokens";
import { AttributeValue, AttrTarget } from "./Tokens";

/**
 * An Attr represents an attribute (CSS/HTML/SVG) that is associated with a specific target.
 * It knows how to apply itself to its target, and may be reactive (atoms, fonts, and some extended tokens).
 *
 * Each target has a single AttrBundle. This bundle creates all of the dynamic styles for its target, and keeps track of
 * any reactive target attrs. This bundle is created and applied when a target is mounted. A reactive attr will re-apply
 * itself to the target when triggered.
 *
 * Note that (regular) color attrs are not reactive; when the color mode changes, the theme takes care of the changes to CSS vars.
 * TODO: this could be done for fonts as well, although fluid fonts would still required reactive Attrs.
 *
 * Attr is an abstract class. Its concrete subclasses are CSSAttr, HTMLAttr, and SVGAttr. Each of these
 * is responsible for the specifics of attribute names (e.g., camel/kebab case).
 *
 */

// function isReactiveAttributeVal(val: AttributeValue): boolean {
//   return val instanceof Atom || (val instanceof Token && val.isReactive());
//   //return val instanceof Atom;
// }

// TODO: debounce??

export abstract class Attr {
  public applyAction?: ReactiveAction;
  public debug = false;
  public abstract setPropertyOrAttributeValue(value: string): void;

  constructor(public target: AttrTarget, public attrName: string, public attrValue: AttributeValue, apply = true) {

    if (this.attrValue instanceof Atom) {
      this.applyAction = reactiveAction(() => this.apply(attrName));
      performAction(this.applyAction);
    } else if (apply) {
      this.apply(attrName);
    }
  }
  apply(s = ""): void {
    const val = this.formatValue();
    if (this.debug) {
      zlog.info(`${this.target}  ${this.attrName} : ${val}`);
    }
    this.setPropertyOrAttributeValue(val);
  }

  // support reactive updates in a DOM inspector
  touch(): void {
    this.toString();
    zget(this.attrValue);
  }

  formatValue(): string {
    const v = zget(this.attrValue);
    // convert the number 0 to "0", false to "false", other falsy values to ""
    const val = v ? v : v === 0 ? "0" : v === false ? "false" : "";
    return Array.isArray(val)
      ? val.map((v) => v.formatForAttributeValue(this.target.theme)).join(" ")
      : val instanceof Token
      ? val.formatForAttributeValue(this.target.theme)
      : val.toString();
  }

  toString(): string {
    return `${this.constructor.name}:${this.attrName}`;
  }
  asStyleString(): string {
    return `${this.attrName}: ${this.formatValue()}`;
  }
  hasValidValue(): boolean {
    return this.formatValue().length > 0;
  }
}

export class CSSAttr extends Attr {
  static create(target: AttrTarget, attrName: string, val: AttributeValue, pseudoName = ""): CSSAttr {
    return new CSSAttr(target, zutil.kebabize(attrName), val, pseudoName, false);
  }
  constructor(target: AttrTarget, attrName: string, attrValue: AttributeValue, pseudoName = "", apply: boolean) {
    super(target, attrName, attrValue, apply || pseudoName !== "");
  }
  setPropertyOrAttributeValue(val: string): void {
    this.target.setProperty(`--${this.attrName}`, val);
  }
}

export class HTMLAttr extends Attr {
  static booleanAttrNames = new Set([
    "autofocus",
    "checked",
    "controls",
    "default",
    "disabled",
    "draggable",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "multiple",
    "muted",
    "novalidate",
    "open",
    "readonly",
    "required",
    "reversed",
    "selected",
  ]);
  static create(target: AttrTarget, attrName: string, val: AttributeValue): HTMLAttr {
    return new HTMLAttr(target, attrName, val);
  }
  constructor(target: AttrTarget, attrName: string, attrVal: AttributeValue) {
    super(target, attrName.startsWith("html_") ? attrName.substring(5) : attrName, attrVal);
  }
  isBoolean(): boolean {
    return HTMLAttr.booleanAttrNames.has(this.attrName.toLowerCase());
  }
  setPropertyOrAttributeValue(val: string): void {
    if (this.isBoolean() && val === "false") {
      this.target.removeAttribute(this.attrName);
    } else {
      this.target.setAttribute(this.attrName, val);
    }
  }
}

export class SVGAttr extends Attr {
  // these need to be kept as camelCase, and not kebabized
  static camelCaseSVGAttrNames = new Set([
    "attributeName",
    "attributeType",
    "baseProfile",
    "calcMode",
    "gradientTransform",
    "gradientUnits",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "pathLength",
    "preserveAspectRatio",
    "refX",
    "refY",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "spreadMethod",
    "targetBox",
    "viewBox",
    "zoomAndPan",
  ]);
  static create(target: AttrTarget, attrName: string, val: AttributeValue): SVGAttr {
    return new SVGAttr(target, SVGAttr.camelCaseSVGAttrNames.has(attrName) ? attrName : zutil.kebabize(attrName), val);
  }
  constructor(target: AttrTarget, attrName: string, attr: AttributeValue) {
    super(target, attrName, attr);
  }
  setPropertyOrAttributeValue(val: string): void {
    if (val !== undefined) {
      this.target.setAttribute(this.attrName, val);
    }
  }

}
