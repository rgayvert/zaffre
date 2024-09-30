import { zlog, zutil } from ":foundation";
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
  restoring = false;

  abstract routeToInitialPath(): void;
  abstract createFullPath(path: string): string;
  abstract adjustPath(path: string): string;
  abstract usesHash(): boolean;

  constructor(public baseURL: string, public rootTitle: string) {
    // handle back/forward buttons
    window.addEventListener("popstate", (event) => this.historyChanged(event));

    this.currentPath = window.location.pathname;
    document.title = rootTitle;
    history.scrollRestoration = "auto";
    zlog.info(`initialPath=${this.currentPath}, baseURL=${this.baseURL}, href=${window.location.href}`);
  }

  redirectToErrorPage(): void {
    this.routeToPath("demos/errorpage");
  }


  // note: this is called from Ensemble.afterAddedToDOM when we're routing to initial path

  // TODO: this doesn't scrollIntoView when coming in with initial path (looks like view isn't created yet)

  async routeToPath(inPath: string): Promise<void> {
    //zlog.info(`routeToPath: href=${inPath}`);

    let routePointView: View | undefined = View.rootView;
    const path = this.adjustPath(inPath);

    this.components = zutil.withoutAll(path.split("/"), [""]);
    if (this.components.length % 2 === 1) {
      this.redirectToErrorPage();
      return;
    }
    while (routePointView && this.components.length > 1) {
      const routePointName = this.components[0];
      routePointView = routePointView.findDescendant(
        (v) => v.routePoint?.name === routePointName
      );
      if (routePointView) {
        routePointView = this.checkEnsemble(routePointView);
        !routePointView && this.redirectToErrorPage();
      } 
    }
    if (routePointView) {
      routePointView.scrollIntoViewIfNeeded();
    }
  }
  
  checkEnsemble(view: View): View | undefined {
    const routePointName = this.components[0];
    if (
      this.components.length > 1 &&
      view.routePoint?.name === routePointName
    ) {
      const routePointValue = this.components[1];
      view.routePoint?.setAndFire(routePointValue);
      this.components.shift();
      this.components.shift();
      // TODO: shouldn't this be a new view?
      return view;
    } else {
      return undefined;
    }
  }

  routeChanged(path: string): void {
    if (!this.restoring) {
      this.addToHistory(path);
    }
  }

  historyChanged(event: PopStateEvent): void {
    // handle back/forward buttons
    this.restoring = true;
    const path = event.state || "/";
    this.routeToPath(path);
    this.restoring = false; 
  }




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

  }
}

