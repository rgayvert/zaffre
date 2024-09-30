import { Circle2D, SplitZPoint2D, ZType, znumber, zpoint2D } from ":foundation";
import { View } from ":view";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";

//
// Basic SVG circle component.
//

export interface SVGCircleOptions extends SVGShapeOptions {
  cx?: znumber;
  cy?: znumber;
  r?: znumber;
  c?: zpoint2D;
  circle?: ZType<Circle2D>;
}
export function SVGCircle(options: SVGCircleOptions): View {
  options.componentName = "SVGCircle";
  if (options.c) {
    [options.cx, options.cy] = SplitZPoint2D(options.c);
  }
  return CreateShape("circle", SVGCircle.svgKeys, SVGCircle.cssKeys, options);
}
SVGCircle.cssKeys = [...SVGShapeCSSKeys];
SVGCircle.svgKeys = [...SVGShapeSVGKeys, "cx", "cy", "r"];
  