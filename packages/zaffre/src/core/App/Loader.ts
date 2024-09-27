import { Atom, ContentSecurity, reactiveAction, performAction, zget, zstring } from ":foundation";

//
//
//

export class Loader {

  static _instance = new Loader();
  static getInstance(): Loader {
    return this._instance;
  }
  applyHref(link: HTMLLinkElement, url: zstring): void {
    link.setAttribute("href", ContentSecurity.qualifyURL(zget(url)));
  }
  addHeaderLink(url: zstring, rel = "stylesheet", type = ""): void {
    const link = document.createElement("link");
    rel && link.setAttribute("rel", rel);
    type && link.setAttribute("type", type);
    if (url instanceof Atom) {
      performAction(reactiveAction(() => this.applyHref(link, url)));
    } else {
      this.applyHref(link, url);
    }
    document.head.appendChild(link);
  }

  addScript(url: string, defer = false): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      if (ContentSecurity.nonce) {
        script.setAttribute("nonce", ContentSecurity.nonce);
      }
      script.setAttribute("src", ContentSecurity.qualifyURL(url));
      if (defer) {
        script.setAttribute("defer", "true");
      }
      script.addEventListener("load", resolve);
      script.addEventListener("error", reject);
      document.body.appendChild(script);
    });
  }
}
