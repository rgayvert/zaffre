import { atom, toggleAtom, ToggleAtom, Tuple2, zstring, zutil } from ":foundation";
import { ZWindow, ColorMode } from ":uifoundation";
import { View, ViewCreator } from ":view";
import { Theme, defaultCoreTheme } from ":theme";
import { HTMLDelegate } from ":corehtml";
import { Loader } from "./Loader";
import { I18n } from "./I18n";
import { AppResources } from "./AppResources";
import { Router } from "./Router";

//
//
//


export enum AppContext {
  Web,
  VSCode,
  Mobile,
}

export interface AppOptions {
  assetBase?: string;
  googleFonts?: string[];
  codicons?: boolean;
  windowBreakpoints?: Tuple2<number>;
  defaultTheme?: Theme;
  useFluidFonts?: boolean;
  rootTitle?: string;
}

const defaultAppOptions: AppOptions = {
  assetBase: "assets",
  windowBreakpoints: [800, 1280],
  googleFonts: [],
  defaultTheme: defaultCoreTheme(),
  rootTitle: "Zaffre",
  useFluidFonts: false,
};

export class App {
  public static instance: App;
  resources: AppResources;
  options: AppOptions;
  router: Router;

  constructor(public appContext = AppContext.Web, inOptions: AppOptions = {}) {
    this.options = zutil.mergeOptions(defaultAppOptions, inOptions);
    App.instance = this;
    this.resources = new AppResources();
    this.router = this.createRouter();
    this.initializeTheme();
    this.initializeWindow();

    console.log(JSON.stringify(import.meta.env));
  }

  initializeTheme(): void {
    Theme.setDefault(this.options.defaultTheme!);
    View.defaultTheme = Theme.default;
    Theme.default.setTarget(HTMLDelegate.rootView);
    Theme.default.useFluidFonts.set(this.options.useFluidFonts || false);
  }
  createRouter(): Router {
    const metaBaseURL = import.meta.env["BASE_URL"];
    const baseURL = metaBaseURL === "/" ? "" : metaBaseURL.endsWith("/") ? metaBaseURL.slice(0, -1) : metaBaseURL;
    const useHash = import.meta.env["VITE_ROUTER"] === "hash";
    return new Router(baseURL, useHash, this.options.rootTitle || "");
  }
  initializeWindow(): void {
    ZWindow.instance.setWindowWidthBreakpoints(this.options.windowBreakpoints!);
  }
  assetBase(): string {
    return this.resources.assetBase;
  }

  customFontNames = new Set<string>();
  useGoogleFont(...fontNames: string[]): void {
    for (const fontName of fontNames) {
      if (!this.customFontNames.has(fontName)) {
        this.addHeaderLink(`${this.resolveResource("url.google-fonts")}${fontName}`);
        this.customFontNames.add(fontName);
      }
    }
  }
  protected useCodicons(): void {
    this.addHeaderLink(this.resolveResource("url.codicons")!);
  }

  async baseInitialize(): Promise<void> {
    await I18n.initialize(resolveURI("locales"));
    await this.resources.load();
    this.options.googleFonts?.forEach((fontName) => this.useGoogleFont(fontName));
    this.options.codicons && this.useCodicons();
  }
  async initialize(): Promise<void> {
    // subclass hook
  }

  async startWith(baseViewFn: ViewCreator, context: AppContext): Promise<void> {
    this.appContext = context;
    await this.baseInitialize();
    this.initialize();
    HTMLDelegate.rootView.options.resolveResource = resolveURI;
    HTMLDelegate.rootView.setTheme(Theme.default);
    HTMLDelegate.setBaseView(baseViewFn());
    setTimeout(() => this.router.routeToInitialPath(), 1000);
  }

  resolveResource(uri: zstring): string {
    return this.resources.resolve(uri);
  }

  // TODO: straighten out who's in charge here: is it the app or the default theme?

  darkMode = atom(false, { name: "darkMode", action: () => this.darkModeChanged() });
  osColorMode(): ColorMode {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? ColorMode.dark
      : ColorMode.light;
  }
  darkModeChanged(): void {
    this.setDefaultColorMode(this.darkMode.get() ? ColorMode.dark : ColorMode.light);
  }
  setDefaultColorMode(colorMode: ColorMode): void {
    Theme.default.colorMode.set(colorMode);
    HTMLDelegate.rootView.setTheme(Theme.default);
    this.darkMode.set(colorMode === ColorMode.dark);
  }

  useFluidFonts = toggleAtom(false);
  static useFluidFonts(): boolean {
    return this.instance.useFluidFonts.get();
  }
  static toggleFluidFonts(): void {
    this.instance.useFluidFonts.toggle();
  }
  static get fluidFonts(): ToggleAtom {
    return this.instance.useFluidFonts;
  }

  addHeaderLink(url: string): void {
    return Loader.getInstance().addHeaderLink(url);
  }
  addScript(url: string): Promise<unknown> {
    return Loader.getInstance().addScript(url);
  }
}

export function isWebContext(): boolean {
  return App.instance.appContext === AppContext.Web;
}
export function t(value: string | Date | number): string {
  return value ? I18n.currentInstance.translate(value.toString()) : "";
}
export function resolveURI(uri: zstring): string {
  return App.instance.resolveResource(uri);
}
export function inDarkMode(): boolean {
  return Theme.default.inDarkMode();
}
export function routeChanged(path: string): void {
  App.instance.router.routeChanged(path);
}
export function routeToPath(path: string): void {
  App.instance.router.routeToPath(path);
}
export function useHashRouting(): boolean {
  return App.instance.router.useHash;
}
