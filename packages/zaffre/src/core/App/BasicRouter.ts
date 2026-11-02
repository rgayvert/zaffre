import { Atom, zlog, zutil } from ":foundation";
import { RouteAtom } from "./RouteAtom";
import { IRouter } from "./Router";
import { RouteNode } from "./RouteNode";

export class BasicRouter implements IRouter {
  routeAtom?: Atom<string>;
  inBackForward = false;
  initialPath: string;
  rootNode: RouteNode;

  constructor(
    public baseURL: string,
    public rootTitle: string,
    public errorPath: string,
    public defaultPath?: string,
  ) {
    window.addEventListener("popstate", (event) => this.historyChanged(event));

    this.initialPath = this.extractInitialPath();
    this.rootNode = new RouteNode("", {}, "");
  }
  historyChanged(event: PopStateEvent): void {
    this.inBackForward = true;
    const fullPath = event.state || "/";
    const path = fullPath.substring(this.baseURL.length);

    //console.log("historyChanged: fullPath=" + fullPath + ",path=" + path);
    
    this.routeToPath(path);
    this.inBackForward = false;
  }

  setInitialPath(path: string): void {
    this.initialPath = path;
  }

  setRouteAtom(atom: Atom<string>): void {
    this.routeAtom = atom;
    atom.addAction((path) => this.addToHistory(path));
  }
  routeToPath(path: string): void {
    const p = path.startsWith("/") ? path.slice(1) : path;
    //const b = this.baseURL.startsWith("/") ? this.baseURL.slice(1) : this.baseURL;
    //this.routeAtom?.set(b ? `${b}/${p}` : p);
    this.routeAtom?.set(p);
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
  addToHistory(inPath: string): void {
    //console.log("addToHistory(1): path=" + inPath + ", state=" + history.state);
    const path = this.fixPath(inPath);
    if (this.inInitialPath) {
      history.replaceState(path, "", path);
    } else if (!this.inBackForward) {
      //console.log("history.state(2)=" + history.state);
      if (path !== history.state) {
        //console.log("addToHistory: " + path);
        history.pushState(path, "", path);
      }
    }
  }
  replaceState(inPath: string): void {
    const path = this.fixPath(inPath);
    history.replaceState(path, "", path);
  }

  inInitialPath = false;
  routeToInitialPath(): void {
    this.inInitialPath = true;
    this.routeToPath(this.getInitialPath());
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
    zlog.info("initialPath: " + path);
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
