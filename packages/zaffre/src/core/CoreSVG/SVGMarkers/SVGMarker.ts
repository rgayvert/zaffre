import { RectToken, rectToken } from ":attributes";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { CreateSVGView } from "../SVGDelegate";
import { addClass, afterOptionsMerged } from ":view";
import { SVGOptions } from "../SVGOptions";
import { znumber, zrect2D, zstring } from ":foundation";

//
// SVGMarker
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


export const SVGMarker = (inOptions: SVGMarkerOptions = {}) => {
  const options = addClass(inOptions, "SVGMarker");
  options.tag = "marker";

  afterOptionsMerged(options, () => {
    if (options.bounds) {
      options.viewBox = rectToken(options.bounds);
    }
  });

  return CreateSVGView("marker", svgKeys, cssKeys, options);
};

const cssKeys = [...SVGViewCSSKeys];
const svgKeys = [...SVGViewSVGKeys, "markerHeight", "markerWidth", "markerUnits", "orient", "preserveAspectRatio", "refX", "refY", "viewBox"];
