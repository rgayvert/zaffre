import { zstring } from "./Atom";
import { FetchAtom, FetchOptions } from "./FetchAtom";

//
// An APIAtom is a generic extension of FetchAtom that has an extraction function to parse the response.
//

export interface APIAtomOptions<T> extends FetchOptions<T> {
  interval?: number;
}

export function apiAtom<T>(url: string, extract: (json: any) => T, initialValue: T, options: APIAtomOptions<T> = {}): APIAtom<T> {
  return new APIAtom(url, initialValue, extract, options);
}

export class APIAtom<T> extends FetchAtom<T> {
  constructor(public url: zstring, public initialValue: T, public extract: (json: any) => T, public options: APIAtomOptions<T>) {
    super(url, initialValue, options);
  }
  async extractValue(response: Response): Promise<T> {
    const json = await response.json();
    return this.extract(json);
  }
}
