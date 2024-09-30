import { View } from ":view";
import { znumber } from ":foundation";
import { css_color, css_percent } from ":attributes";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { CreateSVGView } from "../SVGDelegate";
import { SVGOptions } from "../SVGOptions";

//
// An SVGStop defines a color and its position to use on a gradient. It must be
// contained in an SVGLinearGradient or SVGRadialGradient.
//

export interface SVGStopOptions extends SVGOptions {
  offset?: number | css_percent;
  stopColor?: css_color;
  stopOpacity?: znumber;
}
export function SVGStop(options: SVGStopOptions): View {
  options.componentName = "SVGStop";
  return CreateSVGView("stop", SVGStop.svgKeys, SVGStop.cssKeys, options);
}

SVGStop.cssKeys = [...SVGViewCSSKeys, "stopColor", "stopOpacity"];
SVGStop.svgKeys = [...SVGViewSVGKeys, "offset" ];
