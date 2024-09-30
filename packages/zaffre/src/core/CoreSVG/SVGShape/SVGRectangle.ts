import { SplitZRect2D, ZType, znumber, zrect2D } from ":foundation";
import { View } from ":view";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";

//
// Basic SVG rect component.
//

export interface SVGRectangleOptions extends SVGShapeOptions {
  x?: znumber;
  y?: znumber;
  width?: ZType<number | string>;
  height?: ZType<number | string>;
  rx?: znumber;
  ry?: znumber;
  rect?: zrect2D;
}
export function SVGRectangle(options: SVGRectangleOptions): View {
  options.componentName = "SVGRectangle";
  const r = options.rect;
  if (options.rect) {
    [options.x, options.y, options.width, options.height] = SplitZRect2D(options.rect);
  }
  return CreateShape("rect", SVGRectangle.svgKeys, SVGRectangle.cssKeys, options);
}

SVGRectangle.cssKeys = [...SVGShapeCSSKeys];
SVGRectangle.svgKeys = [...SVGShapeSVGKeys, "x", "y", "rx", "ry", "width", "height"];
