import { fetchTextAtom, zget, zstring } from "../Atom";
import { zutil } from "../Util";

//
// Map semantic keys to paths.
//

type ResMap = Map<string, string>;
type PatternFn = (match: string) => string;

export class ResourceMap {
  static defaultInstance: ResourceMap;
  resMap?: ResMap;
  patterns = new Map<RegExp, PatternFn>();

  constructor(public basePath: string) {}

  addPattern(pattern: RegExp, fn: PatternFn): void {
    this.patterns.set(pattern, fn);
  }

  public resolve(uri: zstring): string {
    const key = zget(uri);
    if (!key) {
      return key;
    }

    for (let pattern of this.patterns.keys()) {
      const result = key.match(pattern);
      if (result && result[1]) {
        return this.patterns.get(pattern)!(result[1]);
      }
    }
    const keyValue = this.resMap?.get(key);
    if (!keyValue) {
      return `${this.basePath}/${key}`;
    } else if (keyValue.includes("/")) {
      return keyValue.startsWith("http") ? keyValue : `${this.basePath}/${keyValue}`;
    } else {
      const [type, fileName] = key.split(".");
      return zutil.formatPath(this.basePath, type, fileName);
    }
  }

  async load(resourcePath: string): Promise<void> {
    const fetchAtom = fetchTextAtom(resourcePath, { getInitialValue: false });
    await fetchAtom.getValue();
    const json = JSON.parse(fetchAtom.get());
    this.resMap = zutil.indexedTypeToMap(json);
    ResourceMap.defaultInstance = this;
  }
}

const resolveResource = (key: zstring): string => {
  return ResourceMap.defaultInstance?.resolve(key) || zget(key);
};

export const resolveURI = (uri: zstring): string => {
  //console.log("resolveURI: "+zget(uri)+", isResource="+uriIsResource(zget(uri))+", val="+(uriIsResource(zget(uri)) ? resolveResource(uri) : zget(uri)));
  return uriIsResource(zget(uri)) ? resolveResource(uri) : zget(uri);
}

export const uriIsResource = (uri: zstring) => {
  const val = zget(uri);
  return !val.startsWith("/") && !val.includes(":");
}