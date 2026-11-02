import { SplitZRect2D, znumber, zrect2D, ZType } from ":foundation";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { addClass, afterOptionsMerged } from ":view";

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


export const SVGRectangle = (inOptions: SVGRectangleOptions) => {
  const options = addClass(inOptions, "SVGRectangle");
  options.tag = "rect";

  afterOptionsMerged(options, () => {
    if (options.rect) {
      [options.x, options.y, options.width, options.height] = SplitZRect2D(options.rect);
    }
  });

  return CreateShape("rect", SVGRectangle.svgKeys, SVGRectangle.cssKeys, options);
};

SVGRectangle.cssKeys = [...SVGShapeCSSKeys];
SVGRectangle.svgKeys = [...SVGShapeSVGKeys, "x", "y", "rx", "ry", "width", "height"];
