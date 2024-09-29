import { Atom, reactiveAction, zget, zstring } from "../Atom";
import { ContentSecurity } from "./ContentSecurity";

//
// Dynamically add a link (typically CSS) to the document head. This is reactive,
// so if the URL changes (e.g., because of dark mode), the link will change.
//

export function applyHref(link: HTMLLinkElement, url: zstring): void {
  link.setAttribute("href", ContentSecurity.qualifyURL(zget(url)));
}
export function addDocumentHeaderLink(url: zstring, rel = "stylesheet", type = ""): void {
  const link = document.createElement("link");
  rel && link.setAttribute("rel", rel);
  type && link.setAttribute("type", type);
  if (url instanceof Atom) {
    reactiveAction(() => applyHref(link, url)).perform();
  } else {
    applyHref(link, url);
  }
  document.head.appendChild(link);
}
