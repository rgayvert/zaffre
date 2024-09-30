import { SplitZPoint2D, SplitZSegment2D, zlength, zpoint2D, zsegment2D } from ":foundation";
import { CreateShape, SVGShapeCSSKeys, SVGShapeOptions, SVGShapeSVGKeys } from "./SVGShape";
import { View } from ":view";
import { SVGStrokeDasharray, SVGStrokeDashoffset, SVGStrokeLinecap, SVGStrokeLinejoin } from "../../CoreOptions/SVGOptions";

//
// Basic SVG line component.
//

export interface SVGLineOptions extends SVGShapeOptions {
  x1?: zlength;
  y1?: zlength;
  x2?: zlength;
  y2?: zlength;
  pt1?: zpoint2D;
  pt2?: zpoint2D;
  segment?: zsegment2D;
  strokeLinecap?: SVGStrokeLinecap;
  strokeLinejoin?: SVGStrokeLinejoin;
  strokeDasharray?: SVGStrokeDasharray;
  strokeDashoffset?: SVGStrokeDashoffset;
}
export function SVGLine(options: SVGLineOptions): View {
  options.componentName = "SVGLine";
  if (options.pt1) {
    [options.x1, options.y1] = SplitZPoint2D(options.pt1);
  }
  if (options.pt2) {
    [options.x2, options.y2] = SplitZPoint2D(options.pt2);
  }
  if (options.segment) {
    [options.x1, options.y1, options.x2, options.y2] = SplitZSegment2D(options.segment);
  }
  return CreateShape("line", SVGLine.svgKeys, SVGLine.cssKeys, options);
}

SVGLine.cssKeys = [...SVGShapeCSSKeys, "strokeLinecap", "strokeLinejoin", "strokeDasharray", "strokeDashoffset"];
SVGLine.svgKeys = [...SVGShapeSVGKeys, "x1", "y1", "x2", "y2",];
