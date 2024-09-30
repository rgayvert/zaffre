import { View } from ":view";
import { css_length_pct } from ":attributes";
import { SVGGradientCSSKeys, SVGGradientOptions, SVGGradientSVGKeys } from "./SVGGradient";
import { CreateSVGView } from "../SVGDelegate";

//
// An SVGLinearGradient defines a linear transition through a sequence of colors. A list of
// SVGStops should be appended to specify the transitions.
//

export interface SVGLinearGradientOptions extends SVGGradientOptions {
  x1?: css_length_pct;
  y1?: css_length_pct;
  x2?: css_length_pct;
  y2?: css_length_pct;
}
export function SVGLinearGradient(options: SVGLinearGradientOptions = {}): View {
  options.componentName = "SVGLinearGradient";
  return CreateSVGView("linearGradient", SVGLinearGradient.svgKeys, SVGLinearGradient.cssKeys, options);
}

SVGLinearGradient.cssKeys = [...SVGGradientCSSKeys];
SVGLinearGradient.svgKeys = [...SVGGradientSVGKeys, "x1", "y1", "x2", "y2"];
