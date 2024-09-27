import { Atom, AtomOptions } from "./Atom";

//
// A RouteAtom is used by an Ensemble to provide application-level routing. An Ensemble knows
// that it is part of routing based on whether its value is a RouterAtom. 
//
// TODO:
//  - should a RouteAtom knows valid values? (see Ensemble/Router)
//

export interface RouteAtomOptions extends AtomOptions {
  matches?: (s: string) => boolean;
  values?: string[];
}

export function routeAtom(name: string, initialValue: string, options: RouteAtomOptions = {}): RouteAtom {
  return new RouteAtom(name, initialValue, options);
}

export class RouteAtom extends Atom<string> {
  constructor(public name: string, public initialValue: string, public options: RouteAtomOptions) {
    super(initialValue, options);
  }
  pathComponent(): string {
    return `${this.name}/${this.get()}/`;
  }
  matches(s: string): boolean {
    return Boolean(this.options.values?.includes(s) || this.options.matches?.(s));
  }

}
