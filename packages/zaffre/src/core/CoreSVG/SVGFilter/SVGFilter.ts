import { ZType, znumber, zstring } from ":foundation";
import { View } from ":view";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { CreateSVGView } from "../SVGDelegate";
import { SVGOptions } from "../SVGOptions";

//
// An SVGFilter is a container for filter primitives.
//
// TODO:
//  - lots of filter primitives to implement
//

export interface SVGFilterPrimitiveOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
  result?: zstring;
}
export const SVGFilterPrimitiveSVGKeys = ["x", "y", "width", "height", "result"];

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
