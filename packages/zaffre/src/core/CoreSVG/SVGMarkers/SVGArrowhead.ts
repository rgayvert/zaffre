import { rect2D } from ":foundation";
import { View } from ":view";
import { SVGPath } from "../SVGShape";
import { SVGMarker, SVGMarkerOptions } from "./SVGMarker";

//
// An SVGArrowhead is a marker that displays an arrowhead.
//
// TODO:
//   - add more options for more kinds of arrowheads
//

export interface SVGArrowheadOptions extends SVGMarkerOptions {
  scale?: number;
}

export function SVGArrowhead(options: SVGArrowheadOptions = {}): View {
  const scale = options.scale || 1.0;

  return SVGMarker({
    bounds: rect2D(0, 0, 10 * scale, 10 * scale),
    refX: `${5 * scale}`,
    refY: `${5 * scale}`,
    markerWidth: 6 * scale,
    markerHeight: 6 * scale,
    orient: "auto-start-reverse",
  }).append(
    SVGPath({
      d: `M 0 0 L ${10 * scale} ${5 * scale} L 0 ${10 * scale} z`,
      fill: options.fill,
      fillOpacity: options.fillOpacity,
    })
  );
}
