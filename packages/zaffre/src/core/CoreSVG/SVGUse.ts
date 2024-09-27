import { zlength } from ":foundation";
import { View } from ":view";
import { CreateSVGView, SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "./SVG";

//
//
//

export interface SVGUseOptions extends SVGOptions {
    href?: string;
    x?: zlength;
    y?: zlength;
}

export function SVGUse(options: SVGUseOptions = {}): View {
  options.componentName = "SVGUse";
  return CreateSVGView("use", SVGUse.svgKeys, SVGViewCSSKeys, options);
}
SVGUse.svgKeys = [...SVGViewSVGKeys, "href", "x", "y"];
