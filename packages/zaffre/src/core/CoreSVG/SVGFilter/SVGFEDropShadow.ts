import { znumber, zstring } from ":foundation";
import { View } from ":view";
import { SVGFilterPrimitiveOptions, SVGFilterPrimitiveSVGKeys, CreateSVGView } from "../SVG";
import { SVGOptions, SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";

//
//
//

export interface SVGFEDropShadowOptions extends SVGOptions, SVGFilterPrimitiveOptions {
  dx?: zstring;
  dy?: zstring;
  stdDeviation?: znumber;
}

export function SVGFEDropShadow(options: SVGFEDropShadowOptions): View {
  return CreateSVGView("feDropShadow", SVGFEDropShadow.svgKeys, SVGFEDropShadow.cssKeys, options);
}

SVGFEDropShadow.cssKeys = [...SVGViewCSSKeys];
SVGFEDropShadow.svgKeys = [...SVGViewSVGKeys, ...SVGFilterPrimitiveSVGKeys, "dx", "dy", "stdDeviation"];
