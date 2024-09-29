import { Router } from "./Router";

//
//
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
    let path = window.location.pathname;
    if (href.includes("/#")) {
      const url = new URL(href);
      path = href.substring(url.origin.length);
      this.routeToPath(url.pathname);
    } else {
      this.routeToPath(path);
    }
  }

  createFullPath(path: string): string {
    return `${this.baseURL}"/#"${path}`;
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
