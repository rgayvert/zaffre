import { View } from ":view";
import { SVGDefs } from "../SVGDefs";
import { SVGCircle } from "../SVGShape";
import { SVGMarker, SVGMarkerOptions } from "./SVGMarker";

//
//
//

export interface SVGContextCircleOptions extends SVGMarkerOptions {

}

export function SVGContextCircle(id: string, options: SVGContextCircleOptions = {}): View {
  return SVGDefs().append(
    SVGMarker({
      id: "circle",
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
    )
  );
}
