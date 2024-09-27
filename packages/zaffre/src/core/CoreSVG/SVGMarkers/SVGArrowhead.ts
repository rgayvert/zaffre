import { rect2D } from ":foundation";
import { View } from ":view";
import { SVGPath } from "../SVGShape";
import { SVGDefs } from "../SVGDefs";
import { SVGMarker, SVGMarkerOptions } from "./SVGMarker";

//
//
//

export interface SVGArrowheadOptions extends SVGMarkerOptions {
  scale?: number;
}

export function SVGArrowhead(id: string, options: SVGArrowheadOptions = {}): View {
  const scale = options.scale || 1.0;

  return SVGDefs().append(
    SVGMarker({
      id: id,
      bounds: rect2D(0, 0, 10 * scale, 10 * scale),
      refX: `${5 * scale}`,
      refY: `${5 * scale}`,
      markerWidth: 6 * scale, 
      markerHeight: 6 * scale,
      orient: "auto-start-reverse",
    }).append(SVGPath({ 
      d: `M 0 0 L ${10 * scale} ${5 * scale} L 0 ${10 * scale} z`,
      fill: options.fill, 
      fillOpacity: options.fillOpacity,
    }))
  );
}

