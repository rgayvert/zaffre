import { znumber } from ":foundation";
import { BV, View, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":view";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { SVGOptions } from "./SVGOptions";
import { CreateSVGView } from "./SVGDelegate";

//
// An SVGGroup is a container used to group other SVG components. A group can be
// reference in an SVGUse component to create an offset copy.
//

export interface SVGGroupOptions extends SVGOptions {
  x?: znumber;
  y?: znumber;
}
defineComponentBundle<SVGGroupOptions>("SVGGroup", "SVGView", {
  x: 0,
  y: 0,
});

export function SVGGroup(inOptions: BV<SVGGroupOptions> = {}): View {
  const options = mergeComponentOptions("SVGGroup", inOptions);

  if (options.x && options.y) {
    options.transform = `translate(${options.x}, ${options.y})`;
  }
  options.componentName = "SVGGroup";
  return restoreOptions(CreateSVGView("g", SVGGroup.svgKeys, SVGGroup.cssKeys, options));
}

SVGGroup.cssKeys = [...SVGViewCSSKeys];
SVGGroup.svgKeys = [...SVGViewSVGKeys, "x", "y", "id"];
