import { Ellipse2D, SplitZPoint2D, ZType, znumber, zpoint2D } from ":foundation";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { addClass } from ":view";

//
// Basic SVG ellipse component.
//

export interface SVGEllipseOptions extends SVGShapeOptions {
  cx?: znumber;
  cy?: znumber;
  c?: zpoint2D;
  rx?: znumber;
  ry?: znumber;
  ellipse?: ZType<Ellipse2D>;
}
export const SVGEllipse = (inOptions: SVGEllipseOptions) => {
  const options = addClass(inOptions, "SVGEllipse");
  if (options.c) {
    [options.cx, options.cy] = SplitZPoint2D(options.c);
  }
  return CreateShape("ellipse", SVGEllipse.svgKeys, SVGEllipse.cssKeys, options);
};
SVGEllipse.cssKeys = [...SVGShapeCSSKeys];
SVGEllipse.svgKeys = [...SVGShapeSVGKeys, "cx", "cy", "rx", "ry"];
