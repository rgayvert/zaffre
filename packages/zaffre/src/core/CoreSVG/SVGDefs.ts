import { View } from ":view";
import { CreateSVGView, SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "./SVG";

//
//
//

export function SVGDefs(options: SVGOptions = {}): View {
  options.componentName = "SVGDefs";
  return CreateSVGView("defs", SVGViewSVGKeys, SVGViewCSSKeys, options);
}
