import { Atom, zstring, zget, BasicAction, AtomOptions } from "./Atom";
import { zlog } from "../Util";
import { ContentSecurity } from "../Support";

//
// A FetchAtom encapsulates the interactions involved in retrieving a value through the Fetch API. 
//
// TODO: 
//  - improve error handling
//

export interface FetchOptions<T> extends AtomOptions {
  action?: BasicAction, 
  //errorValue?: ZType<T>,
  getInitialValue?: boolean,
}


export abstract class FetchAtom<T> extends Atom<T> {

  constructor(public url: zstring, initialValue: T, public options: FetchOptions<T>) {
    options = { getInitialValue: true, ...options };
    super(initialValue, options);

    if (url instanceof Atom) {
      url.addAction(() => this.getValue());
    }
    if (options.getInitialValue) {
      this.getValue();
    }
  }
  abstract extractValue(response: Response): Promise<T>;

  async getValue(): Promise<void> {
    try {
      const path = zget(this.url);
      if (path) {
        const response = await ContentSecurity.fetch(path);
        if (response.ok) {
          this.set(await this.extractValue(response));
          this.options.action?.();
        } else {
          zlog.warn("failed to fetch " + zget(this.url));
          //this.options.errorValue && this.set(zget(this.options.errorValue));
        }
      }
    } catch (e) {
      zlog.warn("failed to fetch " + zget(this.url));
      //this.options.errorValue && this.set(zget(this.options.errorValue));
    }
  }
}

export function fetchTextAtom(url: zstring, options: FetchOptions<string> = {}): FetchTextAtom {
  return new FetchTextAtom(url, options);
}

export class FetchTextAtom extends FetchAtom<string> {
  constructor(public url: zstring, options: FetchOptions<string>) {
    super(url, "", options);
  }
  async extractValue(response: Response): Promise<string> {
    return response.text();
  }
}

export function fetchBlobAtom(url: zstring, options: FetchOptions<Blob> = {}): FetchBlobAtom {
  return new FetchBlobAtom(url, options);
}

export class FetchBlobAtom extends FetchAtom<Blob> {
  constructor(public url: zstring, options: FetchOptions<Blob>) {
    super(url, new Blob([]), options);
    this.getValue();
  }
  async extractValue(response: Response): Promise<Blob> {
    return response.blob();
  }
}

