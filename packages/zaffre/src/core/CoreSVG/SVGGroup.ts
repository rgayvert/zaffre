import { znumber } from ":foundation";
import { View } from ":view";
import { defineComponentDefaults, mergeComponentDefaults } from ":theme";
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
defineComponentDefaults<SVGGroupOptions>("SVGGroup", "SVGView", {
  x: 0,
  y: 0,
});

export function SVGGroup(inOptions: SVGGroupOptions = {}): View {
  const options = mergeComponentDefaults("SVGGroup", inOptions);

  if (options.x && options.y) {
    options.transform = `translate(${options.x}, ${options.y})`;
  }
  options.componentName = "SVGGroup";
  return CreateSVGView("g", SVGGroup.svgKeys, SVGGroup.cssKeys, options);
}

SVGGroup.cssKeys = [...SVGViewCSSKeys];
SVGGroup.svgKeys = [...SVGViewSVGKeys, "x", "y", "id"];
