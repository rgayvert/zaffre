import { znumber, zstring } from ":foundation";
import { SVGFilterPrimitiveOptions, SVGFilterPrimitiveSVGKeys } from "./SVGFilter";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { CreateSVGView } from "../SVGDelegate";
import { SVGOptions } from "../SVGOptions";

//
// A drop shadow filter primitive; must be appended to an SVGFilter component.
//

export interface SVGFEDropShadowOptions extends SVGOptions, SVGFilterPrimitiveOptions {
  dx?: zstring;
  dy?: zstring;
  stdDeviation?: znumber;
}

export const SVGFEDropShadow = (options: SVGFEDropShadowOptions) => {
  return CreateSVGView("feDropShadow", SVGFEDropShadow.svgKeys, SVGFEDropShadow.cssKeys, options);
}

SVGFEDropShadow.cssKeys = [...SVGViewCSSKeys];
SVGFEDropShadow.svgKeys = [...SVGViewSVGKeys, ...SVGFilterPrimitiveSVGKeys, "dx", "dy", "stdDeviation"];
