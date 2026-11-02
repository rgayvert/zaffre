import { Polygon2D, ZType, atom, zget, zstring } from ":foundation";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { addClass } from ":view";

//
// Basic SVG polygon component.
//

export interface SVGPolygonOptions extends SVGShapeOptions {
  points?: zstring;
  polygon?: ZType<Polygon2D>;
}
export const SVGPolygon = (inOptions: SVGPolygonOptions) => {
  const options = addClass(inOptions, "SVGPolygon");

  const polygon = options.polygon;
  if (polygon) {
    options.points = atom(() => zget(polygon).asDelimitedList(" "));
  }
  return CreateShape("polygon", SVGPolygon.svgKeys, SVGPolygon.cssKeys, options);
};

SVGPolygon.cssKeys = [...SVGShapeCSSKeys];
SVGPolygon.svgKeys = [...SVGShapeSVGKeys, "points"];
