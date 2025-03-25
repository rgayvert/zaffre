import { Atom, zstring, zget, AtomOptions } from "./Atom";
import { zlog, ContentSecurity } from "../Util";
import { ResponseAtom, responseAtom, ResponseStatus } from "./ResponseAtom";

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
}

export abstract class FetchAtom<T> extends Atom<T> {

  response = responseAtom();

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

  logBadStatus(status: ResponseStatus, msg: string): void {
    this.response.errorMessage = msg;
    zlog.info(msg);
    this.response.set(status);
  }

  resolve(): ResponseAtom {
    this.getValue();
    return this.response;
  }

  async getValue(): Promise<void> {
    let response;
    try {
      const path = zget(this.url);
      if (path) {
        response = await ContentSecurity.fetch(path);
        if (response.ok) {
          const val = await this.extractValue(response);
          this.set(val);
          if (this.options.valid && !this.options.valid(val)) {
            this.logBadStatus("invalid", "invalid data");
          } else {
            this.response.set("ok");
          }
        } else {
          this.logBadStatus("failed", response.statusText);
        }
      }
    } catch (e) {
      this.logBadStatus("failed", `failed to fetch ${zget(this.url)}`);
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
