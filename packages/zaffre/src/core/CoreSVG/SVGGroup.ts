import { znumber } from ":foundation";
import { View } from ":view";
import { defineComponentDefaults, mergeComponentDefaults } from ":theme";
import { CreateSVGView, SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "./SVG";

//
//
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
