import { zutil } from ":foundation";
import { Router } from "./Router";

//
// A StandardRouter works in a situation where the server supports dynamic routes.
//

export class StandardRouter extends Router {
  constructor(baseURL: string, rootTitle: string, errorPath = "error") {
    super(baseURL, rootTitle, errorPath);
  }
  usesHash(): boolean {
    return false;
  }
  
  getInitialPath(): string {
    return zutil.windowPathNameWithParams();
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
