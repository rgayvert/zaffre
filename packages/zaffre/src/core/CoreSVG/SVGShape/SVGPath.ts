import { zstring } from ":foundation";
import { View } from ":view";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { SVGStrokeLinejoin } from "../../CoreOptions/SVGOptions";

//
// Basic SVG path component.
//

export interface SVGPathOptions extends SVGShapeOptions {
  d?: zstring;
  //path?: zpath2D;
  strokeLinejoin?: SVGStrokeLinejoin;
}

export function SVGPath(options: SVGPathOptions): View {
  options.componentName = "SVGPath";
  return CreateShape("path", SVGPath.svgKeys, SVGPath.cssKeys, options);
}

SVGPath.cssKeys = [...SVGShapeCSSKeys];
SVGPath.svgKeys = [...SVGShapeSVGKeys, "d", "strokeLinejoin"];
