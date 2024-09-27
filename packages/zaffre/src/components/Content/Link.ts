import { zstring, zget, atom } from ":foundation";
import { View, setInnerHTML, resolveURI, simpleEffect, routeToPath, core } from ":core";
import { defineComponentDefaults, mergeComponentDefaults } from ":core";
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
defineComponentDefaults<LinkOptions>("Link", "Box", {
  cursor: "pointer",
  textDecoration: "underline",
  target: "",
  effects: {
    hovered: simpleEffect({ textDecoration: "none", color: core.color.red }),
  },
});

export function Link(uri: zstring, inOptions: LinkOptions = {}): View {
  const options = mergeComponentDefaults("Link", inOptions);

  function setLinkContent(view: View, options: LinkOptions): void {
    options.text && setInnerHTML(view, zget(options.text));
  }
  options.componentName = "Link";
  options.tag = "a";
  const url = resolveURI(uri);
  if (url.startsWith("http")) {
    options.href = atom(() => resolveURI(uri));
    options.onclick = atom(() => `window.open('${resolveURI(uri)}', '${options.target}'); return false;`);
  } else {
    options.clickAction = () => routeToPath(resolveURI(uri));
  }

  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view): void => setLinkContent(view, options);
  return Box(options);
}
