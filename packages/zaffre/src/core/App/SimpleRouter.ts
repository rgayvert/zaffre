import { Atom, zlog, zutil } from ":foundation";
import { RouteAtom } from "./RouteAtom";
import { IRouter } from "./Router";
import { RouteNode } from "./RouteNode"; 

export class SimpleRouter implements IRouter {
  routeAtom?: Atom<string>;
  inBackForward = false;
  rootNode: RouteNode;
  initialPath: string;
 
  constructor( 
    public baseURL: string,
    public rootTitle: string,
    public errorPath: string,
    public defaultPath?: string, 
  ) {
    window.addEventListener("popstate", (event) => this.historyChanged(event));

    this.rootNode = new RouteNode("", {}, "");
    this.rootNode.setAddToHistory((p) => this.addToHistory(p));
    this.initialPath = this.extractInitialPath();
  }
  historyChanged(event: PopStateEvent): void {
    this.inBackForward = true;
    const path = event.state || "/";
    zlog.debug("historyChanged: " + path);
    this.routeToPath(path);
    this.inBackForward = false;
  }

  // setRouteAtom(atom: Atom<string>): void {
  //   this.routeAtom = atom;
  // }
  // createFullPath(path: string): string {
  //   return `${this.baseURL}${path}`;
  // }
  routeToPath(path: string): void {
    zlog.debug("routeToPath: "+path);
    this.rootNode.setPath(path.startsWith("/") ? path.slice(1) : path);
  }
  fixPath(inPath: string): string {
    let path = inPath;
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    if (path.endsWith("/")) {
      path = path.slice(0, path.length - 1);
    }
    return `${this.baseURL}${path}`;
  }
  addToHistory(inPath: string, addToHistory = true): void {
    const path = this.fixPath(inPath);
    if (this.inInitialPath) {
      history.replaceState(path, "", path);
    } else if (!this.inBackForward) {
      zlog.debug("history.state=" + history.state);
      if (path !== history.state) {
        zlog.debug("addToHistory: " + path);
        history.pushState(path, "", path);
      }
    }
  }
  replaceState(inPath: string): void {
    const path = this.fixPath(inPath);
    history.replaceState(path, "", path);
  }

  setInitialPath(path: string): void {
    this.initialPath = path;
  }

  inInitialPath = false;
  routeToInitialPath(): void {
    this.inInitialPath = true;
    this.routeToPath(this.initialPath);
    this.inInitialPath = false;
  }

  addRouteNode(node: RouteAtom<string>): void {}
  routeNodeChanged(node: RouteAtom<string>): void {}
  routeChanged(path: string): void {}

  getInitialPath(): string {
    return this.initialPath;
  }
  extractInitialPath(): string {
    let path = zutil.windowPathNameWithParams();
    if (path.startsWith(this.baseURL)) {
      path = path.substring(this.baseURL.length);
    }
    zlog.debug("initialPath: " + path);
    return path === "/" && this.defaultPath ? this.defaultPath : path;
  }

  getRoutePath(): string {
    return "";
  }
  setRoutePath(path: string): void {}

  redirectingToErrorPage = false;
  redirectToErrorPage(): void {
    if (this.redirectingToErrorPage) {
      zlog.info("Error redirecting to error page");
    } else {
      this.redirectingToErrorPage = true;
      this.routeToPath(this.errorPath);
      this.redirectingToErrorPage = true;
    }
  }
}
