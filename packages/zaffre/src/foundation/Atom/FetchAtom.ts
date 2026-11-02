import { Atom, zstring, zget, AtomOptions, BasicAction, atom } from "./Atom";
import { zlog, ContentSecurity } from "../Util";

//
// A FetchAtom encapsulates the interactions involved in retrieving a value through the Fetch API.
//
// TODO:
//  - improve error handling
//

export interface FetchOptions<T> extends AtomOptions {
  getInitialValue?: boolean;
  timeout?: number;
  valid?: (val: T) => boolean;
  fallbackURL?: zstring;
  failureAction?: BasicAction;
  failureValue?: T;
}

export abstract class FetchAtom<T> extends Atom<T> {
  currentURL: Atom<string>;
  onInitialFetch = true;

  constructor(url: zstring, initialValue: T, public options: FetchOptions<T>) {
    options = { getInitialValue: true, ...options };
    super(initialValue, options);
    this.currentURL = atom(url);
    if (url instanceof Atom) {
      url.addAction(() => this.getValue());
    }
    if (options.getInitialValue) {
      this.getValue();
    }
  }
  abstract extractValue(response: Response): Promise<T>;

  logBadStatus(msg: string): void {
    zlog.info(msg);
    if (this.onInitialFetch && this.options.fallbackURL) {
      this.currentURL.set(zget(this.options.fallbackURL));
      this.getValue();
    } else {
      if (this.options.failureValue) {
        this.set(this.options.failureValue);
      }
      this.options.failureAction?.();
    }
  }

  async getValue(): Promise<void> {
    let response;
    try {
      const path = zget(this.currentURL);
      if (path) {
        response = await ContentSecurity.fetch(path);
        if (response.ok) {
          const val = await this.extractValue(response);
          this.set(val);
          // TODO: how does this get back to the client?
          if (this.options.valid && !this.options.valid(val)) {
            this.logBadStatus("invalid data");
          } else {
          }
        } else {
          this.logBadStatus("failed");
        }
      }
    } catch (e) {
      this.logBadStatus(`failed to fetch ${this.currentURL.get()}`);
    }
  }
}

export const fetchTextAtom = (url: zstring, options: FetchOptions<string> = {}): FetchTextAtom => {
  return new FetchTextAtom(url, options);
};

export class FetchTextAtom extends FetchAtom<string> {
  constructor(public url: zstring, options: FetchOptions<string>) {
    super(url, "", options);
  }
  async extractValue(response: Response): Promise<string> {
    return response.text();
  }
}

export const fetchBlobAtom = (url: zstring, options: FetchOptions<Blob> = {}): FetchBlobAtom => {
  return new FetchBlobAtom(url, options);
};

export class FetchBlobAtom extends FetchAtom<Blob> {
  constructor(public url: zstring, options: FetchOptions<Blob>) {
    super(url, new Blob([]), options);
    this.getValue();
  }
  async extractValue(response: Response): Promise<Blob> {
    return response.blob();
  }
}

export const getBlobURL = async (uri: zstring) => {
  const atom = fetchBlobAtom(uri, { getInitialValue: false });
  await atom.getValue();
  return URL.createObjectURL(atom.get());
}

export const getURITextContents = async (uri: zstring) => {
  const atom = fetchTextAtom(uri, { getInitialValue: false });
  await atom.getValue();
  return atom.get();
}
