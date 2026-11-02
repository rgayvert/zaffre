import { Atom, AtomOptions } from ":foundation";

//
// A RouteAtom is used by an Ensemble to provide application-level routing. An Ensemble knows
// that it is part of routing based on whether its value is a RouterAtom. 
//
// TODO:
//  - should a RouteAtom knows valid values? (see Ensemble/Router)
//

interface IRouter {
  addToHistory(path: string): void;
  replaceState(path: string): void;
}

export interface RouteAtomOptions extends AtomOptions {
  titleFn?: (val: string) => string;
}



export class RouteAtom<T extends string> extends Atom<T> {
  constructor(public router: IRouter, public title: string, public basePath: string, public initialValue: T, public options: RouteAtomOptions) {
    super(initialValue, options);
    this.addAction(() => this.get() && router.addToHistory(this.currentPath));
    //console.log("routeAtom: basePath="+this.basePath);
  }

  setAndReplaceHistory(value: T): void {
    this.setValue(value);
    value && this.router.replaceState(this.currentPath);
  }

  get isRoot(): boolean {
    return this.basePath === "/";
  }
  get currentPath(): string {
    const slash = this.basePath.endsWith("/") ? "" : "/";
    return `${this.basePath}${slash}${this.get()}`;
  }
  get documentTitle(): string {
    return this.options.titleFn?.(this.get()) || this.title;
  }

}
