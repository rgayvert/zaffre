import { ZType, znumber, zget, zstring } from ":foundation";
import { View } from ":view";
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


export function SVGImageBox(url: zstring, options: SVGImageBoxOptions = {}): View {
  options.onGetContent = (): string => zget(url);
  options.onApplyContent = (view: View): void => {
    const src = view.resolveResource(url);
    view.elt.setAttribute("href", src);
  };

  return CreateSVGView("image", SVGImageBox.svgKeys, SVGImageBox.cssKeys, options);
}
SVGImageBox.cssKeys = [...SVGViewCSSKeys];
SVGImageBox.svgKeys = [...SVGViewSVGKeys, "x", "y", "width", "height"];

