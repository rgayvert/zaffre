import { Point2D, zlength } from ":foundation";
import { View } from ":view";
import { CreateSVGView } from "../SVGDelegate";
import { SVGGradientCSSKeys, SVGGradientOptions, SVGGradientSVGKeys } from "./SVGGradient";

//
// An SVGRadialGradient defines a circular transition through a sequence of colors. A list of
// SVGStops should be appended to specify the transitions.
//

export interface SVGRadialGradientOptions extends SVGGradientOptions {
  cx?: zlength;
  cy?: zlength;
  fr?: zlength;
  fx?: zlength;
  fy?: zlength;
  r?: Point2D;
}
export function SVGRadialGradient(options: SVGRadialGradientOptions = {}): View {
  options.componentName = "SVGRadialGradient";
  return CreateSVGView("line", SVGRadialGradient.svgKeys, SVGRadialGradient.cssKeys, options);
}

SVGRadialGradient.cssKeys = [...SVGGradientCSSKeys];
SVGRadialGradient.svgKeys = [...SVGGradientSVGKeys, "cx", "cy", "fr", "fx", "fy", "r"];
