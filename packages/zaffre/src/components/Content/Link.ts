import { zstring, zget, atom, resolveURI } from ":foundation";
import { View, setInnerHTML, routeToPath, addClass, afterOptionsMerged } from ":core";
import { Box, BoxOptions } from "../HTML";

/**
 * Link - a box with HTML content what acts like an HTML anchor.
 *
 * If the target is an external URI, it will call window.open() when clicked; otherwise,
 * the URI is assumed to be an internal path, so routeToPath() is called.
 *
 */

export type LinkTarget = "_self" | "_blank" | "_parent" | "_top" | "";

export interface LinkOptions extends BoxOptions {
  text?: zstring;
  download?: zstring;
  referrerpolicy?: zstring;
  target?: LinkTarget;
}

export const Link = (uri: zstring, inOptions: LinkOptions = {}) => {
  const options = addClass(inOptions, "Link");
  options.tag = "a";
  options.model = uri;
  
  afterOptionsMerged(options, () => {
    const url = resolveURI(uri);
    if (url.startsWith("http")) {
      options.href = atom(() => resolveURI(uri));
      options.onclick = atom(() => `window.open('${resolveURI(uri)}', '${options.target}'); return false;`);
    } else {
      options.clickAction = () => routeToPath(resolveURI(uri));
    }
  });

  const setLinkContent = (view: View, options: LinkOptions): void => {
    options.text && setInnerHTML(view, zget(options.text));
  };

  options.onApplyContent = (view) => setLinkContent(view, options);
  return Box(options);
};
