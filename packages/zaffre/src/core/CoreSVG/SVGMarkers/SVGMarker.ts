import { znumber, zrect2D, zstring } from ":foundation";
import { View } from ":view";
import { RectToken, rectToken } from ":attributes";
import { defineComponentDefaults, mergeComponentDefaults } from ":theme";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { SVGOptions } from "../SVGOptions";
import { CreateSVGView } from "../SVGDelegate";

//
// An SVGMarker is 
//

export interface SVGMarkerOptions extends SVGOptions {
  markerHeight?: znumber;
  markerWidth?: znumber;
  markerUnits?: zstring; // useSpaceOnUse | strokeWidth
  orient?: zstring; // auto | auto-start-reverse | <angle>
  preserveAspectRatio?: zstring; // see SVGContainer
  refX?: zstring; // left|center|right|<coordinate>
  refY?: zstring; // left|center|right|<coordinate>
  bounds?: zrect2D;
  viewBox?: RectToken;
}
defineComponentDefaults<SVGMarkerOptions>("SVGMarker", "SVGView", {
  tag: "marker",
});

export function SVGMarker(inOptions: SVGMarkerOptions): View {
  const options = mergeComponentDefaults("SVGMarker", inOptions);
  options.componentName = "SVGMarker";
  if (options.bounds) {
    options.viewBox = rectToken(options.bounds);
  }
  return CreateSVGView("marker", SVGMarker.svgKeys, SVGMarker.cssKeys, options);
}
SVGMarker.cssKeys = [...SVGViewCSSKeys];
SVGMarker.svgKeys = [...SVGViewSVGKeys, "markerHeight", "markerWidth", "markerUnits", "orient", "preserveAspectRatio", "refX", "refY", "viewBox"];
