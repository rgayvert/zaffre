import { addClass } from ":view";
import { znumber } from ":foundation";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { CreateSVGView } from "./SVGDelegate";
import { SVGOptions } from "./SVGOptions";

//
// An SVGGroup is a container used to group other SVG components. A group can be
// reference in an SVGUse component to create an offset copy.
//

export interface SVGGroupOptions extends SVGOptions {
  x?: znumber;
  y?: znumber;
}

export const SVGGroup = (inOptions: SVGGroupOptions = {}) => {

  const options = addClass(inOptions, "SVGGroup");

  if (options.x && options.y) {
    options.transform = `translate(${options.x}, ${options.y})`;
  }
  return CreateSVGView("g", svgKeys, cssKeys, options);
}

const cssKeys = [...SVGViewCSSKeys];
const svgKeys = [...SVGViewSVGKeys, "x", "y", "id", "transform"];
