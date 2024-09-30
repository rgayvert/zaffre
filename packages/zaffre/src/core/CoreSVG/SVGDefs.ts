import { View } from ":view";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView } from "./SVGDelegate";

//
// An SVGDefs is a view containing a <defs> element. Other SVG components may be added
// to an SVGDefs view for reference with an SVGUse element or by using the view's url.
//
// TODO:
//  - should SVGDefs be used publically, or used behind the scenes?
//  - that is, should an SVG have a defs that def-things get added to?
//

export function SVGDefs(options: SVGOptions = {}): View {
  options.componentName = "SVGDefs";
  return CreateSVGView("defs", SVGViewSVGKeys, SVGViewCSSKeys, options);
}
