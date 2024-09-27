import { ZType, znumber, zstring } from ":foundation";
import { View } from ":view";
import { CreateSVGView, SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "../SVG";

//
//
//

export interface SVGFilterOptions extends SVGOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
  filterRes?: zstring;
  filterUnits?: zstring;
  primitiveUnits?: zstring;
}

export function SVGFilter(options: SVGFilterOptions): View {
  return CreateSVGView("filter", SVGFilter.svgKeys, SVGFilter.cssKeys, options);
}

SVGFilter.cssKeys = [...SVGViewCSSKeys];
SVGFilter.svgKeys = [...SVGViewSVGKeys, "x", "y", "width", "height", "filterRes", "filterUnits", "primitiveUnits"];
