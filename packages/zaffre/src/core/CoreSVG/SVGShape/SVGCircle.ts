import { Circle2D, SplitZPoint2D, znumber, zpoint2D, ZType } from ":foundation";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { addClass, afterOptionsMerged } from ":view";

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

const cssKeys = SVGShapeCSSKeys;
const svgKeys = [...SVGShapeSVGKeys, "cx", "cy", "r"];

export const SVGCircle = (inOptions: SVGCircleOptions = {}) => {
  const options = addClass(inOptions, "SVGCircle");

  afterOptionsMerged(options, (view) => {
    if (options.c) {
      [options.cx, options.cy] = SplitZPoint2D(options.c);
    }
  });

  return CreateShape("circle", svgKeys, cssKeys, options);
};
