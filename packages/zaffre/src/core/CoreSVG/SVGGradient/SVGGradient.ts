import { zstring } from ":foundation";
import { SVGGradientUnits, SVGSpreadMethod,  } from "../../CoreOptions/SVGOptions";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { SVGOptions } from "../SVGOptions";

//
// Common options for SVG gradients
//

export interface SVGGradientOptions extends SVGOptions {
  gradientUnits?: SVGGradientUnits;
  gradientTransform?: zstring;
  href?: zstring;
  spreadMethod?: SVGSpreadMethod;
}


export const SVGGradientCSSKeys = [...SVGViewCSSKeys];
export const SVGGradientSVGKeys = [...SVGViewSVGKeys, "gradientUnits", "gradientTransform", "href", "spreadMethod"];
