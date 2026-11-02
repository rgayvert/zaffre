import { zget, zstring, resolveURI } from ":foundation";
import { addClass, em, loadInnerHTML, zcolor } from ":core";
import { Box, BoxOptions } from "../HTML";
import { ImageBox } from "./ImageBox";

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

export const Icon = (uri: zstring, inOptions: IconOptions = {}) => {
  const options = addClass(inOptions, "Icon");
  options.model = uri;
  options.id ??= zget(uri);
  options.width = em(1);
  options.height = em(1);
  if (!zget(uri)) {
    options.hidden = () => !zget(uri);
  }
  if (!options.id) {
    //console.log("Icon: null url");
  }
  /*
  const applyMaterialContent = (view: View, url: string): void => {
    const parts = url.split("-");
    const cls = parts.slice(0, -1).join("-");
    const name = parts.at(-1);
    // TODO: can be set the style property directly here rather than setting cssText afterwards?
    setInnerHTML(view, `<span class="${cls}"">${name}</span>`);
    view.elt.nonce = ContentSecurity.nonce || "";
    (<HTMLSpanElement>view.elt.children[0]).style.cssText =
      "font-size:inherit;vertical-align: center;text-align:center;display:block;";
  };
  options.onApplyContent = (view): void => {
    const url = resolveURI(uri);
    if (url && url === zget(uri)) {
      zlog.info("possible missing icon resource: " + url);
    }
    if (!url) {
      //zlog.info("null icon uri");
    }
    if (url.startsWith("<svg")) {
      setInnerHTML(view, url);
      view.elt.style.width = "1em";
    } else if (url.startsWith("material")) {
      applyMaterialContent(view, url);
    } else if (url.includes("/assets")) {
      // TODO: use fetch to embed 
      setInnerHTML(view, `<img draggable="false" src="${ContentSecurity.qualifyURL(url)}"></img>`);
      (<HTMLSpanElement>view.elt.children[0]).style.cssText = "width: 1em; height: 1em;display:block;";
    } else {
      setInnerHTML(view, `<span class="${url}"></span>`);
      view.elt.nonce = ContentSecurity.nonce || "";
      (<HTMLSpanElement>view.elt.children[0]).style.cssText =
        "background-color:inherit;font-size:inherit;vertical-align:center;text-align:center;margin-bottom:0.1em";
    }
  };
*/

  const url = resolveURI(uri);
  if (url.endsWith("svg")) {
    options.onApplyContent = async (view) => {
      await loadInnerHTML(uri, view);
      const svgElt = view.elt.children[0];
      if (svgElt) {
        svgElt.setAttribute("fill", "currentColor");
        svgElt.removeAttribute("width");
        svgElt.removeAttribute("height");
      }
    }
    options.color = zcolor.primary;
    return Box(options);
  } else {
    return ImageBox(uri, options);
  }
};
