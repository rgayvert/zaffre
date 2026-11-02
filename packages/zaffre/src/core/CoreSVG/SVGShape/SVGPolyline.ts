import { CreateShape, SVGShapeCSSKeys, SVGShapeSVGKeys } from "./SVGShape";
import { SVGPolygonOptions } from "./SVGPolygon";
import { addClass } from ":view";

//
// Basic SVG polyline component.
//

export const SVGPolyline = (inOptions: SVGPolygonOptions) => {
  const options = addClass(inOptions, "SVGPolyline");

  return CreateShape("polyline", SVGPolyline.svgKeys, SVGPolyline.cssKeys, options);
};
SVGPolyline.cssKeys = [...SVGShapeCSSKeys];
SVGPolyline.svgKeys = [...SVGShapeSVGKeys, "points"];
