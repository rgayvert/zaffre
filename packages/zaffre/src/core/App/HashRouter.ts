import { zutil } from ":foundation";
import { Router } from "./Router";

//
// A HashRouter implements routing by inserting a hash mark (#) into each URL. When the window
// location is changed to a path with the same base URL and a hash, it doesn't reload the page,
// but instead generates a popstate history event. 
//

export class HashRouter extends Router {
  constructor(baseURL: string, rootTitle: string, errorPath: string) {
    super(baseURL, rootTitle, errorPath);
  }
  usesHash(): boolean {
    return true;
  }

  getInitialPath(): string { 
    const href = window.location.href;
    if (href.includes("/#")) {
      return href.substring(href.indexOf("/#") + 2);
    } else {
      return zutil.windowPathNameWithParams();
    }
  }

  historyChanged(event: PopStateEvent): void {
    // handle back/forward buttons
    this.inBackForward = true;
    this.routeToPath(window.location.href);
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
