import { zlog, zget, zstring, ContentSecurity } from ":foundation";
import { em, View, setInnerHTML, resolveURI, core, defineBaseOptions, mergeComponentOptions, BV } from ":core";
import { Box, BoxOptions } from "../HTML";

/*
 * An icon is a content view that contains a (typically small) SVG, specified using either as a resource path
 * or as a font icon (e.g., material, codicon).
 *
 * TODO:
 *   - generalize the way different font icons are handled
 *   - unclear if we need to handle inline situations differently
 */

export interface IconOptions extends BoxOptions {
  //inline?: zboolean;
}
defineBaseOptions<IconOptions>("Icon", "Box", {
  color: core.color.inherit,
  background: core.color.inherit,
  lineHeight: em(1),
});

export function Icon(uri: zstring, inOptions: BV<IconOptions> = {}): View {
  const options = mergeComponentOptions("Icon", inOptions);

  options.id ??= zget(uri);
  if (!zget(uri)) {
    zlog.info("null icon uri");
  }

  function applyMaterialContent(view: View, url: string): void {
    const parts = url.split("-");
    const cls = parts.slice(0, -1).join("-");
    const name = parts.at(-1);
    // TODO: can be set the style property directly here rather than setting cssText afterwards?
    setInnerHTML(view, `<span class="${cls}"">${name}</span>`);
    view.elt.nonce = ContentSecurity.nonce || "";
    (<HTMLSpanElement>view.elt.children[0]).style.cssText =
      "font-size:inherit;vertical-align: center;text-align:center;display:block;";
  }
  options.onGetContent = (): string => resolveURI(uri);
  options.onApplyContent = (view: View): void => {
    const url = resolveURI(uri);
    if (url && url === zget(uri)) {
      zlog.info("possible missing icon resource: " + url);
    }
    if (!url) {
      zlog.info("null icon uri");
    }
    if (url.startsWith("<svg")) {
      setInnerHTML(view, url);
      view.elt.style.width = "1.8ch";
    } else if (url.startsWith("material")) {
      applyMaterialContent(view, url);
    } else if (url.includes("/assets")) {
      setInnerHTML(view, `<img draggable="false" src="${ContentSecurity.qualifyURL(url)}"></img>`);
      (<HTMLSpanElement>view.elt.children[0]).style.cssText = "width: 0.75em;height:0.75em;display:block;";
    } else {
      setInnerHTML(view, `<span class="${url}"></span>`);
      view.elt.nonce = ContentSecurity.nonce || "";
      (<HTMLSpanElement>view.elt.children[0]).style.cssText =
        "background-color:inherit;font-size:inherit;vertical-align:center;text-align:center;margin-bottom:0.1em";
    }
  };
  return Box(options);
}
