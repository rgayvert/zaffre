import { lazyinit } from ":foundation";
import { Attr } from "./Attr";

//
// Dynamic creation of styles. The attribute bundle for a view will attempt to create
// a new style if it has any CSS attributes. If there is an existing style with the
// exact string definition, that style will be used.
//

export class ZStyleSheet {
  public static create(stylesheet: CSSStyleSheet): ZStyleSheet {
    return new ZStyleSheet(stylesheet);
  }

  private static createDefault(): ZStyleSheet {
    const styleSheet = this.create(this.defaultCSSStyleSheet());
    // Check normalize.css if we use additional tags
    // reset; (Safari requires these to be set separately)
    ["html", "body", "div", "h1", "h2", "h3", "h4", "h5", "h6", "p"].forEach((tag) => styleSheet.addRule(tag, "margin: 0; padding: 0; border: 0;"));
    styleSheet.addRule("*, *:before, *:after", "box-sizing: border-box");
    styleSheet.addRule("textarea:focus", "outline: none");   // for vscode extensions

    styleSheet.addRule("::-webkit-calendar-picker-indicator", "display: var(--picker-display); -webkit-appearance: var(--picker-display)");

    // rules used internally
    styleSheet.addRule(".hidden", "display: none !important;");
    styleSheet.addRule(".offscreen", "position: absolute; left: -9999px;");
    return styleSheet;
  }

  @lazyinit public static get default(): ZStyleSheet {
    return this.createDefault();
  }
 
  /**
   * Return a CSS stylesheet in which to load our styles. All recent browsers seem
   * to support adoptedStyleSheets, so we'll use this instead of an existing one.
   */
  private static defaultCSSStyleSheet(): CSSStyleSheet {
    const stylesheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [stylesheet]
    return stylesheet;
  }

  /** A collection of styles, keyed by name */
  public readonly styles = new Map<string, ZStyle>();
  public readonly rules = new Map<string, CSSRule>();

  private constructor(private stylesheet: CSSStyleSheet) {
    this.stylesheet = stylesheet;
  }

  /**
   * Add a rule to the end of our stylesheet
   *
   * @param selector the style name
   * @param attributes a semicolon-separated list of CSS attributes
   * @returns the new CSSRule
   */
  public addRule(selector: string, attributes: string): CSSRule {
    let rule = this.rules.get(selector);
    if (!rule) {
      const index = this.stylesheet.cssRules.length;
      this.stylesheet.insertRule(`${selector} {\n${attributes};\n}`, index);
      rule = this.stylesheet.cssRules[index];
      this.rules.set(selector, rule);
    }
    return rule;
  }
  public deleteRule(rule: CSSRule): void {
    const idx = this.indexOfRule(rule);
    if (idx !== -1) {
      this.stylesheet.deleteRule(idx);
    }
  }

  public addStyle(fullName: string, style: ZStyle): void {
    this.styles.set(fullName, style);
  }
  public styleMatching(pattern: RegExp): ZStyle | undefined {
    const key = [...this.styles.keys()].find((key) => key.match(pattern));
    return key ? this.styles.get(key) : undefined;
  }
  public styleNamed(name: string): ZStyle | undefined {
    const fullName = name[0] === "." ? name : "." + name;
    return this.styles.get(fullName);
  }
  hasStyleNamed(name: string): boolean {
    const fullName = name[0] === "." ? name : "." + name;
    return Boolean(this.styles.get(fullName));
  }
  public indexOfRule(rule: CSSRule): number {
    return Array.from(this.stylesheet.cssRules).indexOf(rule);
  }
}

///////////////////////////////////////////////////////////////////////////////////

export class ZStyle {
  static stylesByRule = new Map<string, ZStyle>();

  public static named(name: string): ZStyle | undefined {
    return ZStyleSheet.default.styleNamed(name);
  }
  public static create(name: string, attrs: Attr[], zstylesheet = ZStyleSheet.default): ZStyle {
    const inst = new ZStyle(name, attrs, zstylesheet);

    if (name.includes("_v_")) {
      const ruleString = inst.asRule();
      const existingStyle = this.stylesByRule.get(ruleString);
      if (existingStyle) {
        return existingStyle;
      }
      this.stylesByRule.set(ruleString, inst);
    }

    inst.addToStyleSheet();
    return inst;
  }
  public addToStyleSheet(): ZStyle {
    const fullName = /^(\.|:)/.test(this.name) ? this.name : "." + this.name;
    this.zstylesheet.addStyle(fullName, this);
    this.rule = this.zstylesheet.addRule(fullName, this.asRule());
    return this;
  }

  private rule?: CSSRule;

  constructor(public name: string, public attrs: Attr[], public zstylesheet = ZStyleSheet.default) {}

  private shorthandCompare(attr1: Attr, attr2: Attr): number {
    const a = attr1.attrName;
    const b = attr2.attrName;
    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }
    const aparts = a.split("-");
    const bparts = b.split("-");
    if (aparts[0] !== bparts[0] || aparts.length === bparts.length) {
      return a.localeCompare(b);
    }
    if (aparts.length === 3) {
      return 1;
    }
    if (bparts.length === 3) {
      return -1;
    }
    return a.localeCompare(b);
  }

  // Sort so that shorthand attributes are added first. Note: if there is a shorthand and individual
  // properties, the cssText as seen in the debugger will contain the expanded individual properties.
  // If the shorthand attribute is reactive (i.e., has an inline value that is a CSS var), the shorthand
  // attribute will not be visible, but will still be affected by a change to the var. For example, if
  // you have { border: atom(() => ...), borderColor: core.color.blue }, you will see 13 border-* 
  // attributes, but not 'border: var(--border)'. If you then set --border to '3px dotted red', the 
  // computed values will show the updated border-width and border-style, but the color will be blue.

  public asRule(indent = 0): string {
    const space = " ".repeat(indent); 
    return this.attrs
      .filter((attr) => attr.hasValidValue())
      .sort(this.shorthandCompare)
      .map((attr) => space + attr.asStyleString())
      .join(";\n");
  }

  public asString(): string {
    return `${this.name} : {\n${this.asRule()}\n}`;
  }
  private index(): number {
    return this.rule ? this.zstylesheet.indexOfRule(this.rule) : -1;
  }
}
