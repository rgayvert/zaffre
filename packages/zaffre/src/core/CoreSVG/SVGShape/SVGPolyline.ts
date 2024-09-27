import { View } from ":view";
import { CreateShape, SVGShapeCSSKeys, SVGShapeSVGKeys } from "./SVGShape";
import { SVGPolygonOptions } from "./SVGPolygon";

//
//
//

export function SVGPolyline(options: SVGPolygonOptions): View {
  options.componentName = "SVGPolyline";
  return CreateShape("polyline", SVGPolyline.svgKeys, SVGPolyline.cssKeys, options);
}
SVGPolyline.cssKeys = [...SVGShapeCSSKeys];
SVGPolyline.svgKeys = [...SVGShapeSVGKeys, "points"];

