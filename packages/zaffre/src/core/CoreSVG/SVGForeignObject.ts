import { ZType, znumber } from ":foundation";
import { View } from ":view";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView } from "./SVGDelegate";

//
// An SVGForeignObject is a component that may contain HTML components.
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

