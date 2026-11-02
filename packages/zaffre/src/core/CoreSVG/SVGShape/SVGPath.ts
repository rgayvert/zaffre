import { zstring } from ":foundation";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { SVGStrokeLinejoin } from "../../CoreOptions";
import { addClass } from ":view";

//
// Basic SVG path component.
//

export interface SVGPathOptions extends SVGShapeOptions {
  d?: zstring;
  //path?: zpath2D;
  strokeLinejoin?: SVGStrokeLinejoin;
}

export const SVGPath = (inOptions: SVGPathOptions) => {
  const options = addClass(inOptions, "SVGPath");

  return CreateShape("path", SVGPath.svgKeys, SVGPath.cssKeys, options);
};

SVGPath.cssKeys = [...SVGShapeCSSKeys];
SVGPath.svgKeys = [...SVGShapeSVGKeys, "d", "strokeLinejoin"];
