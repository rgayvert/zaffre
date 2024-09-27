import { zget, Atom, atom, lazyinit, point2D, piecewiseLinearAtom } from ":foundation";
import { MappingAtomR1, stepFunctionAtom, zutil, ToggleAtom, toggleAtom } from ":foundation";
import { Font, Color, ColorMode, ZWindow } from "../UIFoundation";
import { ColorToken, FontToken, ITheme, Token, css_length } from "../Attributes";
import { ComponentDefaultsMap, LocalDefaults, View, ViewCreator, ViewOptions } from "../View";

//
//
//

const baseDefaults: ComponentDefaultsMap = new Map<string, ViewOptions>();
const defaultsStack: ComponentDefaultsMap[] = [baseDefaults];

function currentDefaults(): ComponentDefaultsMap {
  return defaultsStack.at(-1)!;
}

// Each component may define default values for its options. These ae merged in the component function 
// with incoming options. A component may also have localDefaults, which specify defaults for decendents.

export function defineComponentDefaults<T extends ViewOptions>(
  componentName: string,
  parentComponent: string,
  options: T
): T {
  options.componentName = componentName;
  const opts = mergeComponentDefaults(parentComponent, options);
  baseDefaults.set(componentName, opts);
  return opts;
}

export function mergeOptions<T extends ViewOptions>(options1: T, options2: T): T {
  return Object.assign({ ...options1 }, options2);
}

export function localDefaultsFor(compName: string): LocalDefaults {
  let answer: LocalDefaults = {};
  localDefaultsStack.toReversed().forEach((def) => {
    if (def[compName]) {
      answer = zutil.mergeOptions(answer, def[compName]);
    }
  });
  return answer;
}

//
//  mergeComponentDefaults() is called when a component is being 
//
export function mergeComponentDefaults<T extends ViewOptions>(componentName: string, inOptions: T): T {
  let defaults = currentDefaults().get(componentName) || {};
  const localDefaults = localDefaultsFor(componentName);
  if (localDefaults) {
    defaults = zutil.mergeOptions(defaults, localDefaults);
  }
  defaults.events && inOptions.events && Object.assign(defaults.events, inOptions.events);
  defaults.effects && inOptions.effects && Object.assign(defaults.effects, inOptions.effects);
  defaults.extraVars && inOptions.extraVars && defaults.extraVars.push(...inOptions.extraVars);
  defaults.animations && inOptions.animations && defaults.animations.push(...inOptions.animations);

  return <T>zutil.mergeOptions(defaults, inOptions);
}

const localDefaultsStack: LocalDefaults[] = [];

export function evaluateWithLocalDefaults(localDefaults: LocalDefaults, fn: ViewCreator): View {
  localDefaultsStack.push(localDefaults);
  const view = fn();
  localDefaultsStack.pop();
  return view;
}



export abstract class Theme implements ITheme {
  // The App instance is required to supply a default Theme
  private static _defaultTheme: Theme;
  public static setDefault(theme: Theme): void {
    this._defaultTheme = theme;
    theme.setCSSVars();
  }
  public static get default(): Theme {
    return this._defaultTheme;
  }
  public static defaultColorMode(): ColorMode {
    return this._defaultTheme ? this._defaultTheme.colorMode.get() : ColorMode.light;
  }

  // the current Theme is set by the view which is currently being rendered
  public static get current(): Theme {
    return <Theme>View.themeStack.at(-1) || this.default;
    //return <Theme>View.currentParent.theme;
  }

  @lazyinit static get activeTokens(): Map<string, Token> {
    return new Map<string, Token>();
  }
  @lazyinit static get activeFontTokens(): Map<string, Token> {
    return new Map<string, Token>();
  }
  @lazyinit static get activeColorTokens(): Map<string, Token> {
    return new Map<string, Token>();
  }

  view: View;
  componentOptions = new Map<string, ViewOptions>();
  colorContrastRatio = atom(7.0, { action: () => this.setColorCSSVars() });
  useFluidFonts: ToggleAtom;

  isDefault(): boolean {
    return this === Theme.default;
  }
  parentTheme(): ITheme | undefined {
    return this.view?.theme || this.view?.parent?.theme;
  }

  public get currentColorContractRatio(): number {
    return this.colorContrastRatio.get();
  }

  @lazyinit get standardFontMapping(): MappingAtomR1 {
    const mapping = stepFunctionAtom(
      [point2D(0, 1.0), point2D(600, 1.15), point2D(900, 1.2), point2D(9999, 1.2)],
      ZWindow.windowWidthAtom()
    );
    mapping.addAction(() => this.setFontCSSVars());
    return mapping;
  }
  @lazyinit get fluidFontMapping(): MappingAtomR1 {
    const mapping = piecewiseLinearAtom(
      [point2D(0, 1.0), point2D(600, 1.0), point2D(900, 1.15), point2D(1920, 1.2), point2D(9999, 1.2)],
      ZWindow.windowWidthAtom()
    );
    mapping.addAction(() => this.setFontCSSVars());
    return mapping;
  }
  get currentFontScale(): MappingAtomR1 {
    return this.useFluidFonts.get() ? this.fluidFontMapping : this.standardFontMapping;
  }

  constructor(public name: string, initialColorMode = ColorMode.light, fluidFonts = false) {
    this.colorMode = atom(initialColorMode);
    this.useFluidFonts = toggleAtom(fluidFonts);
    this.createCompositeTokens();
    this.colorMode.addAction(() => this.setColorCSSVars());
    this.view = View.rootView;
  }

  setTarget(view: View): void {
    this.view = view;
    this.setCSSVars();
  }

  registerToken(token?: Token): void {
    const key = token?.cssKey() || "";
    if (token && token.hasCSSVar() && !Theme.activeTokens.has(key)) {
      this.setCSSVarFromToken(token);
      Theme.activeTokens.set(key, token);
      if (token instanceof FontToken) {
        Theme.activeFontTokens.set(key, token);
      }
      if (token instanceof ColorToken) {
        Theme.activeColorTokens.set(key, token);
      }
    }
  }

  setCSSVarFromToken(token: Token): void {
    this.view.setProperty(token.cssKey(), token.formatWithTheme(this));
  }
  setCSSVarSet(tokens: Iterable<Token>): void {
    Array.from(tokens)
      .sort((a, b) => a.key.localeCompare(b.key))
      .forEach((token) => this.setCSSVarFromToken(token));
  }
  setCSSVars(): void {
    this.setCSSVarSet(Theme.activeTokens.values());
  }
  setFontCSSVars(): void {
    this.setCSSVarSet(Theme.activeFontTokens.values());
  }
  setColorCSSVars(): void {
    const colorTokens = Array.from(Theme.activeColorTokens.values());
    this.setCSSVarSet(colorTokens.filter((token) => !token.cssKey().includes("-contrast")));
    this.setCSSVarSet(colorTokens.filter((token) => token.cssKey().includes("-contrast")));
  }

  getComponentOptions(name: string): ViewOptions {
    return this.componentOptions.get(name) || currentDefaults().get(name) || {};
  }

  abstract colorForKey(key: string): Color;
  abstract fontForKey(key: string): Font;
  abstract spaceForKey(key: string): string;
  abstract roundingForKey(key: string): string;
  abstract fixedColorKeys(): string[];
  abstract semanticColorKeys(): string[];
  abstract keyColors(): Map<string, Color>;

  colorMode: Atom<ColorMode>;
  inDarkMode(): boolean {
    return this.colorMode.get() === ColorMode.dark;
  }
  setColorMode(mode: ColorMode): void {
    this.colorMode.set(mode);
  }
  toggleColorMode(): void {
    this.setColorMode(this.colorMode.get() === ColorMode.light ? ColorMode.dark : ColorMode.light);
  }

  previousWindowWidth = window.innerWidth;

  scaledFontSize(fontToken: FontToken): number {
    const font = this.fontForKey(fontToken.key);
    return font.size * (this.currentFontScale.get() || 1.0);
  }

  formatFont(font: Font): string {
    return font.toStringWithScale(this.currentFontScale.get() || 1.0);
  }
  formatCSSLength(len: css_length): string {
    const val = zget(len);
    return val instanceof Token ? val.formatWithTheme(this) : "";
  }

  createCompositeTokens(): void {
    this.createBorderTokens();
  }

  createBorderTokens(): void {}
}