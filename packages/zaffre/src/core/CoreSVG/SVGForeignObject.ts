import { ZType, znumber } from ":foundation";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView } from "./SVGDelegate";
import { addClass } from ":view";

//
// An SVGForeignObject is a component that may contain HTML components.
//

export interface SVGForeignObjectOptions extends SVGOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
}

export const SVGForeignObject = (inOptions: SVGForeignObjectOptions) => {
  const options = addClass(inOptions, "SVGForeignObject");

  return CreateSVGView("foreignObject", SVGForeignObject.svgKeys, SVGForeignObject.cssKeys, options);
};

SVGForeignObject.cssKeys = [...SVGViewCSSKeys];
SVGForeignObject.svgKeys = [...SVGViewSVGKeys, "x", "y", "width", "height"];
