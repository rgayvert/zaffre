import { Point2D, zlength } from ":foundation";
import { CreateSVGView } from "../SVGDelegate";
import { SVGGradientCSSKeys, SVGGradientOptions, SVGGradientSVGKeys } from "./SVGGradient";
import { addClass } from ":view";

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
export const SVGRadialGradient = (inOptions: SVGRadialGradientOptions = {}) => {
  const options = addClass(inOptions, "SVGRadialGradient");

  return CreateSVGView("line", SVGRadialGradient.svgKeys, SVGRadialGradient.cssKeys, options);
};

SVGRadialGradient.cssKeys = [...SVGGradientCSSKeys];
SVGRadialGradient.svgKeys = [...SVGGradientSVGKeys, "cx", "cy", "fr", "fx", "fy", "r"];
