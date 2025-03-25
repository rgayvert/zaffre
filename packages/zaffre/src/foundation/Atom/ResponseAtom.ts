import { Atom, AtomAction, AtomOptions, BasicAction } from "./Atom";

export type ResponseStatus = "pending" | "ok" | "missing" | "invalid" | "timedOut" | "failed";

export type ResponseFn = (...args: any[]) => ResponseAtom;
export type ResponseAction = (response: ResponseAtom) => void;

export interface ResponseAtomOptions extends AtomOptions {
  timeout?: number;
}
export function responseAtom(value: ResponseStatus = "pending", options: ResponseAtomOptions = {}): ResponseAtom {
  return new ResponseAtom(value, options);
}
export class ResponseAtom extends Atom<ResponseStatus> {
  static defaultTimeout = 1e6;

  errorMessage = "";
  constructor(value: ResponseStatus = "pending", options: ResponseAtomOptions = {}) {
    super(value, { timeout: ResponseAtom.defaultTimeout, ...options, alwaysFire: true });
    if (options.timeout) {
        setTimeout(() => this.set("timedOut"), options.timeout);
    }
  }
  get ok(): boolean {
    return this.get() === "ok";
  }
  get timedOut(): boolean {
    return this.get() === "timedOut";
  }
  get pending(): boolean {
    return this.get() === "pending";
  }
  then(action: BasicAction): ResponseAtom {
    this.addAction((val) => this.ok && action());
    return this;
  }

  // if we have already resolved this response before we had a chance to add this action, perform this action
  addAction(action?: AtomAction<ResponseStatus>): ResponseAtom {
    if (this.get() !== "pending") {
      action?.(this.val);
    }
    super.addAction(action);
    return this;
  }

}

function nextResponseChain(finalResponse: ResponseAtom, ...responseFns: ResponseFn[]): void {
  const response = responseFns[0]();
  response.addAction((status) => {
    if (status === "ok") {
      if (responseFns.length === 1) {
        finalResponse.set("ok");  // last fn succeeded, so resolve final with ok
      } else {
        // continue
        nextResponseChain(finalResponse, ...responseFns.slice(1));
      }
    } else {
      finalResponse.set(status);  // resolve final with an error
    }
  })
}


export function responseChain(timeout: number, ...responseFns: ResponseFn[]): ResponseAtom {
  const finalResponse = responseAtom();
  setTimeout(() => { 
    if (!finalResponse.pending && !finalResponse.ok) {
      finalResponse.set("timedOut" );  // resolve with a timeout
    }
  }, timeout);
  if (responseFns.length > 0) {
    nextResponseChain(finalResponse, ...responseFns);
  }
  return finalResponse;
}

