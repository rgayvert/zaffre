import { ZType, znumber } from ":foundation";
import { View } from ":view";
import { CreateSVGView, SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "./SVG";

//
//
//

export interface SVGForeignObjectOptions extends SVGOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
}

export function SVGForeignObject(options: SVGForeignObjectOptions): View {
  options.componentName = "SVGForeignObject";
  return CreateSVGView("foreignObject", SVGForeignObject.svgKeys, SVGForeignObject.cssKeys, options);
}

SVGForeignObject.cssKeys = [...SVGViewCSSKeys];
SVGForeignObject.svgKeys = [...SVGViewSVGKeys, "x", "y", "width", "height"];

