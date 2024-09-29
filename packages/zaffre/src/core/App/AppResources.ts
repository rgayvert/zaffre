import { apiAtom, zget, zstring, zutil } from ":foundation";

//
// There is a single instance of AppResources, created by the App instance. It is primarily
// responsible for mapping application URIs into URLs, as specified in the resources.json file,
// which is loaded when the application starts up.
//
// TODO: 
//   - clean up the resolution rules
//   - should this be called AppAssets? 
//

export type ResourceMap = Map<string, string>;

export class AppResources {
  assetBase: string;

  constructor(public assetDir = "assets") {
    this.assetBase = import.meta.env.MODE === "development" ? `/${assetDir}` : `${import.meta.env.BASE_URL}/${assetDir}`;
  }
  resourceCache = new Map<string, string>();

  public _resolveResource(uri: string): string {
    const resourceMapValue = this.resourceMap?.get(uri);
    if (resourceMapValue && uri.startsWith("anchor")) {
      return resourceMapValue;
    } else if (resourceMapValue) {
      return resourceMapValue.includes(":") || !resourceMapValue.includes(".")
        ? resourceMapValue
        : zutil.formatPath(this.assetBase, resourceMapValue); // `${this.assetBase}/${resourceMapValue}`;
        //: `${this.assetBase}/${resourceMapValue}`;
    } else if (uri.includes(":")) {
      return uri;
    } else if (uri.includes("/")) {
      return zutil.formatPath(this.assetBase, uri); // `${this.assetBase}/${uri}`;
      //return `${this.assetBase}/${uri}`;
    } else if (uri.includes(".")) {
      // generate a path from the resource name
      const [type, fileName] = zget(uri).split(".");
      return zutil.formatPath(this.assetBase, type, fileName); // ${this.assetBase}/${type}/${fileName}`;
      //return `${this.assetBase}/${type}/${fileName}`;
    } else {
      return zutil.formatPath(this.assetBase, uri); // `${this.assetBase}/${uri}`;
      //return `${this.assetBase}/${uri}`;
    }
  }
  public resolve(uri: zstring): string {
    const name = zget(uri);
    return zutil.getMapValue(this.resourceCache, name, () => this._resolveResource(name));
  }

  resourceMap?: ResourceMap;
  extractResourceMap(json: any): ResourceMap {
    this.resourceMap = zutil.indexedTypeToMap(json);
    return this.resourceMap;
  }

  async load(): Promise<void> {
    const url = `${this.assetBase}/resources.json`;
    const atom = apiAtom(
      url,
      (response: Response) => this.extractResourceMap(response),
      new Map<string, string>()
    );
    await atom.getValue();
  }
}
