import { Atom, AtomOptions, zlog } from ":foundation";

//
// A RouteNode is used to provide application-level routing.
// 
//

export interface RouteNodePatterns {
  [key: string]: string;
}

export const routeNode = (name: string, patterns: RouteNodePatterns, initialValue: string, options: AtomOptions = {}): RouteNode => {
  return new RouteNode(name, patterns, initialValue, options);
};

export class RouteNode extends Atom<string> {
  children: RouteNode[] = [];
  parent?: RouteNode;
  //parentPatternKey?: string;
  addToHistory?: (val: string) => void;

  constructor(
    public name: string,
    public patterns: RouteNodePatterns,
    public initialValue: string,
    public options: AtomOptions = {},
  ) {
    super(initialValue, options);
    this.options.alwaysFire = true;
    this.options.name = name || "root";
    this.options.debug = true;
  }

  resetAll(): void {
    this.reset();
    this.children.forEach((c) => c.resetAll());
  }

  rootNode(): RouteNode {
    return this.isRoot ? this : this.parent!.rootNode();
  }

  addChildWithPatterns(name: string, patterns: RouteNodePatterns, initialValue = "", options: AtomOptions = {}): RouteNode {
    const child = routeNode(name, patterns, initialValue, options);
    this.addChild(child);
    return child;
  }

  setAddToHistory(fn: (val: string) => void): void {
    this.addToHistory = fn;
  }
  setPatterns(patterns: RouteNodePatterns): void {
    this.patterns = patterns;
  }
  matchForPath(path: string): [string, RegExpMatchArray | undefined] {
    const remappedPath = this.remapValue(path);
    for (const patternKey in this.patterns) {
      const pattern = this.patterns[patternKey];
      const result = remappedPath.match(new RegExp(`${pattern}`));
      if (result) {
        return [patternKey, result];
      }
    }
    return ["", undefined];
  }
  acceptsPath(path: string): boolean {
    return !!this.matchForPath(path);
  }
  childAcceptingPath(path: string): RouteNode | undefined {
    return this.children.find((c) => c.acceptsPath(path));
  }

  setPath(path: string): void {
    const [patternKey, matchResult] = this.matchForPath(path);
    if (matchResult) {
      const match = this.isLeaf || matchResult.length === 1 ? matchResult[0] : matchResult[1];
      const rest = path.substring(match.length + 1);
      this.set(match);
      zlog.debug("match="+match+", rest="+rest);
      if (rest) {
        const child = this.children.find((c) => c.name === patternKey);
        zlog.debug("child="+child?.name);
        child && child.setPath(rest);
      } else {
        this.rootNode().addToHistory?.(this.valuePath);
      }
    }
  }
  extendPath(ext: string, previous: string): void {
    let root = this.valuePath;
    if (previous && root.endsWith(previous)) {
      root = root.slice(0, -previous.length - 1);
    }
    this.rootNode().addToHistory?.(`${root}/${ext}`);
  }

  get isRoot(): boolean {
    return this.name === "";
  }
  get isLeaf(): boolean {
    return this.children.length === 0;
  }
  get valuePath(): string {
    return this.isRoot ? this.get() : `${this.parent!.valuePath}/${this.get()}`;
  }

  addChild(child: RouteNode): void {
    this.children.push(child);
    child.parent = this;
  }
  get path(): string {
    if (this.isRoot) {
      return "/";
    } else {
      const ppath = this.parent!.path;
      const slash = ppath.endsWith("/") ? "" : "/";
      return `${ppath}${slash}${this.name}`;
    }
  }
  descendantWithPath(path: string): RouteNode | undefined {
    if (this.path === path) {
      return this;
    } else {
      for (const node of this.children) {
        const found = node.descendantWithPath(path);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }
}
