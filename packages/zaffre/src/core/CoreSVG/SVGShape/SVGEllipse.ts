import { Ellipse2D, SplitZPoint2D, ZType, atomx, znumber, zpoint2D } from ":foundation";
import { View } from ":view";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";

//
//
//

export interface SVGEllipseOptions extends SVGShapeOptions {
  cx?: znumber;
  cy?: znumber;
  c?: zpoint2D;
  rx?: znumber;
  ry?: znumber;
  ellipse?: ZType<Ellipse2D>
}
export function SVGEllipse(options: SVGEllipseOptions): View {
  options.componentName = "SVGEllipse";
  if (options.c) {
    [options.cx, options.cy] = SplitZPoint2D(options.c);
  }
  return CreateShape("ellipse", SVGEllipse.svgKeys, SVGEllipse.cssKeys, options);
}
SVGEllipse.cssKeys = [...SVGShapeCSSKeys];
SVGEllipse.svgKeys = [...SVGShapeSVGKeys, "cx", "cy", "rx", "ry"];
