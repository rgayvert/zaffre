import { Atom, atom, resolveURI, ResourceMap, toggleAtom, ToggleAtom, Tuple2, zutil } from ":foundation";
import { ColorMode, ZWindow } from "../UIFoundation";
import { View, ViewCreator, addRootDefaults, setDefaultTheme } from "../View";
import { Theme, defaultCoreTheme } from "../Theme";
import { HTMLDelegate } from "../CoreHTML";
import { addDocumentHeaderLink } from "../DOM";
import { I18n } from "./I18n";
import { IRouter } from "./Router";
import { HashRouter } from "./HashRouter";
import { StandardRouter } from "./StandardRouter";
import { RouteAtom, RouteAtomOptions } from "./RouteAtom";
import { BasicRouter } from "./BasicRouter";
import { RouteNode } from "./RouteNode";

//
// There is a single instance of App for a given application. The entry point to the application
// (<appname.ts>) will normally create a subclass of App. An App is responsible for:
//   - creating a resource manager (AppResources);
//   - creating a router
//   - establishing the default theme
//   - setting up window breakpoints
//   - adding initial header links (e.g. fonts)
//   - creating any necessary services
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
  appTitle?: string;
  errorPath?: string;
  defaultPath?: string;
  routeToInitialPath?: boolean;
  useBasicRouter?: boolean;
}

const defaultAppOptions: AppOptions = {
  assetBase: "assets",
  windowBreakpoints: [800, 1280],
  googleFonts: [],
  defaultTheme: defaultCoreTheme(),
  rootTitle: "Zaffre",
};

export class App {
  public static instance: App;
  resourceMap: ResourceMap;
  options: AppOptions;
  router: IRouter;

  constructor(
    public appContext = AppContext.Web,
    options: AppOptions = {},
  ) {
    this.options = zutil.mergeOptions(defaultAppOptions, options);
    App.instance = this;
    this.resourceMap = this.createResourceMap();
    this.router = this.createRouter();
    this.initializeTheme();
    this.initializeWindow();

    //zlog.info(`import.meta.env: ${JSON.stringify(import.meta.env)}`);
  }

  createResourceMap(): ResourceMap {
    return new ResourceMap(this.resourceURL());
  }

  initializeTheme(): void {
    Theme.setDefault(this.options.defaultTheme!);
    setDefaultTheme(Theme.default);
    Theme.default.setTarget(HTMLDelegate.rootView);
    Theme.default.useFluidFonts.set(this.options.useFluidFonts || false);
  }
  useHashRouting(): boolean {
    return import.meta.env.VITE_ROUTER === "hash";
  }
  baseURL(): string {
    const metaBaseURL = import.meta.env.BASE_URL;
    return metaBaseURL === "/" ? "" : metaBaseURL.endsWith("/") ? metaBaseURL.slice(0, -1) : metaBaseURL;
  }
  resourceURL(): string {
    return `${this.baseURL()}/assets`;
  }
  createRouter(): IRouter {
    const baseURL = this.baseURL();
    const rootTitle = this.options.rootTitle || "";
    const errorPath = this.options.errorPath || "errorpage";
    const defaultPath = this.options.defaultPath;
    return this.options.useBasicRouter
      ? new BasicRouter(baseURL, rootTitle, errorPath, defaultPath)
      : this.useHashRouting()
        ? new HashRouter(baseURL, rootTitle, errorPath, defaultPath)
        : new StandardRouter(baseURL, rootTitle, errorPath, defaultPath);
  }
  initializeWindow(): void {
    ZWindow.instance.setWindowWidthBreakpoints(this.options.windowBreakpoints!);
  }
  // assetBase(): string {
  //   return this.resources.assetBase;
  // }
  linkPathPrefix(): string {
    const hash = this.useHashRouting() ? "/#" : "";
    const base = import.meta.env.VITE_BASE_URL;
    return `${base}${hash}`;
  }

  customFontNames = new Set<string>();
  useGoogleFont(...fontNames: string[]): void {
    for (const fontName of fontNames) {
      if (!this.customFontNames.has(fontName)) {
        addDocumentHeaderLink(`${resolveURI("url.google-fonts")}${fontName}`);
        this.customFontNames.add(fontName);
      }
    }
  }
  protected useCodicons(): void {
    addDocumentHeaderLink(resolveURI("url.codicons")!);
  }

  async baseInitialize(): Promise<void> {
    await this.resourceMap.load(`${this.resourceURL()}/resources.json`);
    await I18n.initialize(resolveURI("locales"));
    this.options.googleFonts?.forEach((fontName) => this.useGoogleFont(fontName));
    this.options.codicons && this.useCodicons();
  }
  async initialize(): Promise<void> {
    // subclass hook
  }

  async startWith(baseViewFn: ViewCreator, context: AppContext): Promise<void> {
    this.appContext = context;

    await this.baseInitialize();
    await this.initialize();
    HTMLDelegate.rootView.setTheme(Theme.default);
    HTMLDelegate.setBaseView(baseViewFn());
    HTMLDelegate.bodyView.options.model = this;

    if (this.options.routeToInitialPath) {
      setTimeout(() => this.router.routeToInitialPath(), 1000);
    }
  }

  // async resolveURI(uri: zstring) {
  //   return this.resources.resolve(uri);
  // }
  // async resolveAndApplyURI(uri: zstring, fn: (url: string, view: View) => void) {
  //   return this.resources.resolveAndApplyURI(uri, fn);
  // }

  // TODO: straighten out who's in charge here: is it the app or the default theme?

  darkMode = atom(false, { name: "darkMode", action: () => this.darkModeChanged() });
  osColorMode(): ColorMode {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? ColorMode.dark : ColorMode.light;
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

  installComponentDefaults(defaults: any): void {
    addRootDefaults(defaults);
  }
}

export const isWebContext = (): boolean => {
  return App.instance.appContext === AppContext.Web;
};
export const t = (value: string | Date | number): string => {
  return value ? I18n.currentInstance.translate(value.toString()) : "";
};

export const inDarkMode = (): boolean => {
  return Theme.default.inDarkMode();
};

export const addRouteNode = (node: RouteAtom<string>): void => {
  App.instance.router.addRouteNode(node);
};
export const routeNodeChanged = (node: RouteAtom<string>): void => {
  App.instance.router.routeNodeChanged(node);
};

export const routeChanged = (path: string): void => {
  App.instance.router.routeChanged(path);
};
export const routeToPath = (path: string, addToHistory = true): void => {
  App.instance.router.routeToPath(path, addToHistory);
};
export const initialPath = (): string => {
  return App.instance.router.getInitialPath();
};
export const routeToInitialPath = (): void => {
  App.instance.router.routeToInitialPath();
};
export const getRoutePath = (): string => {
  return App.instance.router.getRoutePath();
};
export const setRoutePath = (path: string) => {
  App.instance.router.setRoutePath(path);
};
export const setInitialRoutePath = (path: string) => {
  App.instance.router.setInitialPath(path);
};
export const setRouterAtom = (atom: Atom<string>) => {
  if (App.instance.router instanceof BasicRouter) {
    App.instance.router.setRouteAtom(atom);
  }
};
export const routeAtom = <T extends string>(title: string, basePath: string, initialValue: T, options: RouteAtomOptions = {}): RouteAtom<T> => {
  return new RouteAtom(App.instance.router, title, basePath, initialValue, options);
};
export const addToRouterHistory = (path: string) => {
  App.instance.router.addToHistory(path);
};
export const replaceHistoryState = (path: string) => {
  App.instance.router.replaceState(path);
};
export const redirectToErrorPage = () => {
  App.instance.router.redirectToErrorPage();
};

export const useHashRouting = (): boolean => {
  return App.instance.useHashRouting();
};
export const linkPathPrefix = (): string => {
  return App.instance.linkPathPrefix();
};
export const baseURL = (): string => {
  return App.instance.baseURL();
};

export const rootRouteNode = () => {
  return App.instance.router.rootNode;
};

export const routeNodeWithPath = (path: string): RouteNode | undefined => {
  const node = App.instance.router.rootNode;
  return path === "/" ? node : node.descendantWithPath(path);
};
