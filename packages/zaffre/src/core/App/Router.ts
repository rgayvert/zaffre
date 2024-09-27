import { zutil } from ":foundation";
import { View } from ":view";

//
//
//

// TODO:
//  - improve error page handling; we're only catching some bad urls currently
//
export class Router {
  currentPath = "";
  previousPath = "";
  newPath = "";
  pathHistory: string[] = [];
  components: string[] = [];
  restoring = false;

  constructor(public baseURL: string, public useHash: boolean, public rootTitle: string) {
    // handle back/forward buttons
    window.addEventListener("popstate", (event) => this.historyChanged(event));

    this.currentPath = window.location.pathname;
    document.title = rootTitle;
    history.scrollRestoration = "auto";
    console.log("initialPath=" + this.currentPath + ", baseURL="+this.baseURL);
  }

  redirectToErrorPage(): void {
    this.routeToPath("demos/errorpage");
  }

  async routeToInitialPath(): Promise<void> {
    const href = window.location.href;
    let path = window.location.pathname;
    if (this.useHash && href.includes("/#")) {
      const url = new URL(href);
      path = href.substring(url.origin.length);
      this.routeToPath(url.pathname);
    } 
    this.routeToPath(path);
  }

  // note: this is called from Ensemble.afterAddedToDOM when we're routing to initial path

  // TODO: this doesn't scrollIntoView when coming in with initial path (looks like view isn't created yet)

  async routeToPath(path: string): Promise<void> {

    if (this.useHash && path.includes("/#")) {
      const href = window.location.href;
      const idx = href.indexOf("/#") + 2;
      path = href.substring(idx);
    }
    let routePointView: View | undefined = View.rootView;
    if (path.startsWith(this.baseURL)) {
      path = path.substring(this.baseURL.length);
    }
    if (path.startsWith("/#")) { 
      path = path.substring(2);
    }
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
      console.log("routePointView: "+routePointView);
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
    const path = event.state || "/";
    //zlog.info("historyChanged, state = " + event.state+", path="+path);
    this.restoring = true;
    this.routeToPath(path);
    this.restoring = false; 
  }

  addToHistory(path: string): void {
    //console.log("addToHistory: "+path);
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    if (path.endsWith("/")) { 
      path = path.slice(0, path.length - 1);
    }
    const hash = this.useHash ? "/#" : "";
    path = `${this.baseURL}${hash}${path}`;
    
    history.pushState(path, "", path);
    const last =  path.split("/").at(-1);
    document.title = last ? `Gallery: ${last}` : "Zaffre Gallery";

  }
}
