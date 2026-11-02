import { arrayAtom, zget, zlog } from ":foundation";
import { RouteAtom } from "./RouteAtom";
import { RouteNode, routeNode } from "./RouteNode";

//
// There is one instance of a Router in an application. This can be:
//   - a StandardRouter, if the server supports dynamic routes; otherwise
//   - a HashRouter (e.g., GitHub pages)
//
// A Router works with browser history to support links within the application, and
// to jump to a location in the application from a URL.
//
// Internal routing depends on Ensembles and RouteAtoms, which provide branch points.
//
// The choice of router should be specified by the environment, hence a value in import.meta.env.
//
// TODO:
//  - improve error page handling; currently we're only catching some bad urls
//

export interface IRouter {
  addRouteNode(node: RouteAtom<string>): void;
  routeNodeChanged(node: RouteAtom<string>): void;
  routeChanged(path: string): void;
  routeToPath(path: string, addToHistory?: boolean): void;
  getInitialPath(): string;
  setInitialPath(path: string): void;
  routeToInitialPath(): void;
  getRoutePath(): string;
  setRoutePath(path: string): void;
  addToHistory(path: string): void;
  replaceState(path: string): void;
  redirectToErrorPage(): void;
  rootNode: RouteNode;
}

export abstract class Router implements IRouter {
  currentPath = "";
  previousPath = "";
  newPath = "";
  pathHistory: string[] = [];
  components: string[] = [];
  inBackForward = false;
  routePath = "";

  rootNode = routeNode("root", {}, "");

  expandingTargetPath = false;
  targetPath = "";
  targetParts: string[] = [];
  routeNodes = arrayAtom<RouteAtom<string>>([]);

  setInitialPath(path: string): void {
    // TODO
  }
  setRoutePath(path: string): void {
    this.routePath = path;
  }
  getRoutePath(): string {
    return this.routePath;
  }

  addRouteNode(node: RouteAtom<string>): void {
    console.log("addRouteNode1: " + node.title + ", isRoot=" + node.isRoot);
    // an ensemble has just been added to the DOM
    if (node.isRoot) {
      console.log("clearing routeNodes");
      this.routeNodes.clear();
    }
    this.routeNodes.push(node);
    //this.addToHistory(node.currentPath);
  }
  routeNodeChanged(node: RouteAtom<string>): void {
    const idx = this.routeNodes.indexOf(node);
    console.log("routeNodeChanged: " + node.title + ", idx=" + idx);
    if (idx !== -1) {
      // remove nodes after this one
      this.routeNodes.splice(idx + 1);
      this.previousPath && this.addToHistory(this.previousPath);
      this.previousPath = node.currentPath;
    }
  }
  async routeToPath(path: string, addToHistory = true): Promise<void> {
    console.log("routeToPath: " + path);
    this.routePath = path;
    this.routeNodes.at(0)?.set(path.slice(1));
  }

  abstract getInitialPath(): string;
  abstract createFullPath(path: string): string;
  abstract adjustPath(path: string): string;
  abstract usesHash(): boolean;
  initialPath: string;

  constructor(
    public baseURL: string,
    public rootTitle: string,
    public errorPath: string,
    public defaultPath?: string,
  ) {
    // listen for back/forward buttons
    window.addEventListener("popstate", (event) => this.historyChanged(event));

    this.rootNode.setAddToHistory((p) => this.addToHistory(p));

    this.currentPath = window.location.pathname;
    document.title = rootTitle;
    history.scrollRestoration = "auto";
    this.initialPath = this.getInitialPath();
    zlog.info(`initialPath=${this.initialPath}, baseURL=${this.baseURL}, href=${window.location.href}`);
  }

  redirectingToErrorPage = false;
  redirectToErrorPage(): void {
    if (this.redirectingToErrorPage) {
      zlog.info("Error redirecting to error page");
    } else {
      this.redirectingToErrorPage = true;
      this.routeToPath(this.errorPath, false);
      this.redirectingToErrorPage = true;
    }
  }

  routeToInitialPath(): void {
    this.routeToPath(this.initialPath, false);
  }

  // Handling a back/forward is a bit tricky. We don't want to pushState() in
  // this case, but we will still get a delayed routeChanged() message, so we
  // reset inBackForward after we get that message.

  historyChanged(event: PopStateEvent): void {
    this.inBackForward = true;
    const path = event.state || "/";
    zlog.info("historyChanged: " + path);
    this.routeToPath(path, false);
    this.inBackForward = false;
  }

  routeChanged(path: string): void {
    zlog.info("routeChanged: " + path + ", inBF=" + this.inBackForward);

    if (!this.inBackForward) {
      this.addToHistory(path);
    }
  }

  // A route to "" or "/" has no component pair, so we need to manually get the
  // first route point and clear it.
  // routeToHome(): void {
  //   const firstRoutePointView = getBodyView().findDescendant((v) => v.routePath() !== "");
  //   firstRoutePointView && firstRoutePointView.routePoint?.resetToInitialValue();
  // }

  // Call pushState() to add a history item
  lastEntry = "";
  fixPath(inPath: string): string {
    let path = inPath;
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    if (path.endsWith("/")) {
      path = path.slice(0, path.length - 1);
    }
    return path;
  }
  addToHistory(inPath: string): void {
    console.log("addToHistory: " + inPath + ", documentTitle=" + document.title);
    const path = this.fixPath(inPath);
    if (path === this.lastEntry) {
      return;
    }
    const fullPath = this.createFullPath(path);

    document.title = this.routeNodes.at(-1)?.documentTitle || "";
    history.pushState(fullPath, "", fullPath);

    zlog.info("pushState: " + fullPath + "  " + document.title);
    this.lastEntry = fullPath;
  }
  replaceState(inPath: string): void {
    const path = this.fixPath(inPath);
    history.pushState(path, "", path);
  }
}
