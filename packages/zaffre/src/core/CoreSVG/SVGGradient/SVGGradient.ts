import { zstring } from ":foundation";
import { SVGGradientUnits, SVGSpreadMethod,  } from "../SVGOptions";
import { SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "../SVG";

//
//
//

export interface SVGGradientOptions extends SVGOptions {
  gradientUnits?: SVGGradientUnits;
  gradientTransform?: zstring;
  href?: zstring;
  spreadMethod?: SVGSpreadMethod;
}


export const SVGGradientCSSKeys = [...SVGViewCSSKeys];
export const SVGGradientSVGKeys = [...SVGViewSVGKeys, "gradientUnits", "gradientTransform", "href", "spreadMethod"];
