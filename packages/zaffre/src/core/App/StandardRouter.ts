import { Router } from "./Router";

//
// A StandardRouter works in a situation where the server supports dynamic routes.
//

export class StandardRouter extends Router {
  constructor(public baseURL: string, public rootTitle: string) {
    super(baseURL, rootTitle);
  }
  usesHash(): boolean {
    return false;
  }
  
  async routeToInitialPath(): Promise<void> {
    this.routeToPath(window.location.pathname);
  }

  createFullPath(path: string): string {
    return `${this.baseURL}${path}`;
  }

  adjustPath(inPath: string): string {
    let path = inPath;
    if (path.startsWith(this.baseURL)) {
      path = path.substring(this.baseURL.length);
    }
    return path;
  }
}
