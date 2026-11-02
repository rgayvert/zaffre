import { ZType, znumber, zget, zstring, resolveURI } from ":foundation";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView } from "./SVGDelegate";

//
// SVGImageBox contains a single image.
//
// TODO: make this reactive (see SVGText)
//

export interface SVGImageBoxOptions extends SVGOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
}


export const SVGImageBox = (url: zstring, options: SVGImageBoxOptions = {}) => {
  options.onApplyContent = (view): void => {
    const src = resolveURI(url);
    view.elt.setAttribute("href", src);
  };

  return CreateSVGView("image", SVGImageBox.svgKeys, SVGImageBox.cssKeys, options);
}
SVGImageBox.cssKeys = [...SVGViewCSSKeys];
SVGImageBox.svgKeys = [...SVGViewSVGKeys, "x", "y", "width", "height"];

