import { View } from ":view";
import { SVGCircle } from "../SVGShape";
import { SVGMarker, SVGMarkerOptions } from "./SVGMarker";

//
// An SVGContextCircle is a marker that displays a circle using context stroke and fill (so
// it take on the attributes of the attached line/path).
//
// TODO:
//   - generalize this, add options
//

export interface SVGContextCircleOptions extends SVGMarkerOptions {}

export function SVGContextCircle(options: SVGContextCircleOptions = {}): View {
  return SVGMarker({
    refX: "3",
    refY: "3",
    markerWidth: 6,
    markerHeight: 6,
    markerUnits: "strokeWidth",
  }).append(
    SVGCircle({
      cx: 3,
      cy: 3,
      r: 2,
      stroke: "context-stroke",
      fill: "context-fill",
    })
  );
}
