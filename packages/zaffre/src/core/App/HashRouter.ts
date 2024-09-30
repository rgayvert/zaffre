import { Router } from "./Router";

//
// A HashRouter implements routing by inserting a hash mark (#) into each URL. When the window
// location is changed to a path with the same base URL and a hash, it doesn't reload the page,
// but instead generates a popstate history event. 
//

export class HashRouter extends Router {
  constructor(public baseURL: string, public rootTitle: string) {
    super(baseURL, rootTitle);
  }
  usesHash(): boolean {
    return true;
  }

  async routeToInitialPath(): Promise<void> { 
    const href = window.location.href;
    if (href.includes("/#")) {
      this.routeToPath(href.substring(href.indexOf("/#") + 2));
    } else {
      this.routeToPath(window.location.pathname);
    }
  }

  historyChanged(event: PopStateEvent): void {
    // handle back/forward buttons
    this.restoring = true;
    this.routeToPath(window.location.href);
    this.restoring = false; 
  }

  createFullPath(path: string): string {
    return `${this.baseURL}/#${path}`;
  }

  adjustPath(inPath: string): string {
    let path = inPath;
    if (path.includes("/#")) {
      const href = window.location.href;
      const idx = href.indexOf("/#") + 2;
      path = href.substring(idx);
    }
    if (path.startsWith(this.baseURL)) {
        path = path.substring(this.baseURL.length);
    }
    if (path.startsWith("/#")) {
        path = path.substring(2);
    }
    return path;
  }
}
