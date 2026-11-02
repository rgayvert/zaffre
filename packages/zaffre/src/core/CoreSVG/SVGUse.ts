import { Point2D, zlength } from ":foundation";
import { addClass, View } from ":view";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView } from "./SVGDelegate";

//
// An SVGUse component make a copy of another component and applies an offset.
//

export interface SVGUseOptions extends SVGOptions {
  x?: zlength;
  y?: zlength;
  href?: string;
}

export const SVGUse = (component: View, offset: Point2D, inOptions: SVGUseOptions = {}) => {
  const options = addClass(inOptions, "SVGUse");
  options.href = `#${component.zname}`;
  options.x = offset.x;
  options.y = offset.y;

  return CreateSVGView("use", SVGUse.svgKeys, SVGViewCSSKeys, options);
};
SVGUse.svgKeys = [...SVGViewSVGKeys, "href", "x", "y"];
