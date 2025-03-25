import { pollAtom, PollAtom, zlog, zutil } from ":foundation";
import { View } from ":view";

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

export abstract class Router {
  currentPath = "";
  previousPath = "";
  newPath = "";
  pathHistory: string[] = [];
  components: string[] = [];
  inBackForward = false;

  abstract getInitialPath(): string;
  abstract createFullPath(path: string): string;
  abstract adjustPath(path: string): string;
  abstract usesHash(): boolean;

  constructor(public baseURL: string, public rootTitle: string, public errorPath: string) {
    // listen for back/forward buttons
    window.addEventListener("popstate", (event) => this.historyChanged(event));

    this.currentPath = window.location.pathname;
    document.title = rootTitle;
    history.scrollRestoration = "auto";
    zlog.info(`initialPath=${this.currentPath}, baseURL=${this.baseURL}, href=${window.location.href}`);
  }

  redirectToErrorPage(): void {
    this.routeToPath(this.errorPath, false);
  }

  routeToInitialPath(): void {
    this.routeToPath(this.getInitialPath(), false);
  }

  routePointView?: PollAtom<View>;

  async routeToPathFromView(path: string, view: View): Promise<void> {
    this.routePointView = pollAtom(() => view.findDescendant(
      (v) => v.routePath() === path
    ), 1000, 100);
    await this.routePointView.wait();
  }

  routerNodePoller(path: string, view: View): PollAtom<View> {
    return pollAtom(() => view.findDescendant(
      (v) => v.routePath() === path
    ), 2000, 100);
  }

  async routeToPath(inPath: string, addToHistory = true): Promise<void> {
    const path = this.adjustPath(inPath);
    if (path === "/") {
      return this.routeToHome();
    }
    const components = zutil.withoutAll(path.split("/"), [""]);
    if (components.length % 2 === 1) {
      this.redirectToErrorPage();
      return;
    }
    //zlog.info("routeToPath: "+path);
    let partialPath = "";
    let routePointView: View | undefined = View.rootView;
    while (routePointView && components.length > 1) {
      const routePointName = components.shift()!;
      const routePointValue = components.shift()!;
      partialPath = zutil.joinPathComponents(partialPath, routePointName);
      const poller = this.routerNodePoller(partialPath, routePointView);
      await poller.wait();
      routePointView = poller.get();
      if (routePointView) {
        routePointView.routePoint?.set(routePointValue);

        //zlog.info("routePoint="+routePointView.routePoint+", routePointValue: "+routePointValue);

        partialPath = zutil.joinPathComponents(partialPath, routePointValue);
      } else {
        this.redirectToErrorPage();
      }
    }
    addToHistory && this.addToHistory(inPath);
    this.inBackForward = false; 

  }


  // Handling a back/forward is a bit tricky. We don't want to pushState() in
  // this case, but we will still get a delayed routeChanged() message, so we 
  // reset inBackForward after we get that message.

  historyChanged(event: PopStateEvent): void {
    this.inBackForward = true;
    const path = event.state || "/";
    //zlog.info("historyChanged: "+path);
    this.routeToPath(path, false);
  }

  routeChanged(path: string): void {
    //zlog.info("routeChanged: "+path+", inBF="+this.inBackForward);

    if (!this.inBackForward) {
      this.addToHistory(path);
    }
  }

  // A route to "" or "/" has no component pair, so we need to manually get the
  // first route point and clear it.
  routeToHome(): void {
    const firstRoutePointView = View.bodyView.findDescendant(
      (v) => v.routePath() !== ""
    );
    firstRoutePointView && firstRoutePointView.routePoint?.set("");
  }


  // Call pushState() to add a history item
  addToHistory(path: string): void {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    if (path.endsWith("/")) { 
      path = path.slice(0, path.length - 1);
    }
    const fullPath = this.createFullPath(path);
    
    history.pushState(fullPath, "", fullPath);
    const last = fullPath.split("/").at(-1);
    document.title = last ? `${this.rootTitle}: ${last}` : this.rootTitle;

    //zlog.info("pushState: "+fullPath + "  "+ document.title);
  }
}

