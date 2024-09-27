import { Polygon2D, ZType, atom, zget, zstring } from ":foundation";
import { View } from ":view";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";

//
//
//

export interface SVGPolygonOptions extends SVGShapeOptions {
  points?: zstring;
  polygon?: ZType<Polygon2D>;
}
export function SVGPolygon(options: SVGPolygonOptions): View {
  options.componentName = "SVGPolygon";
  const polygon = options.polygon;
  if (polygon) {
    options.points = atom(() => zget(polygon).asDelimitedList(" "));
  }
  return CreateShape("polygon", SVGPolygon.svgKeys, SVGPolygon.cssKeys, options);
}

SVGPolygon.cssKeys = [...SVGShapeCSSKeys];
SVGPolygon.svgKeys = [...SVGShapeSVGKeys, "points"];

