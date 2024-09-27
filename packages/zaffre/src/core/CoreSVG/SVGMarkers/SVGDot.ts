import { rect2D, znumber } from ":foundation";
import { View } from ":view";
import { css_color } from ":attributes";
import { SVGDefs } from "../SVGDefs";
import { SVGCircle } from "../SVGShape";
import { SVGPaint } from "../SVGOptions";
import { SVGMarker, SVGMarkerOptions } from "./SVGMarker";

//
//
//

export interface SVGDotOptions extends SVGMarkerOptions {
  fill?: SVGPaint;
  scale?: number;
  stroke?: css_color;
  strokeWidth?: znumber;
}

export function SVGDot(id: string, options: SVGDotOptions = {}): View {
  const scale = options.scale || 1.0;

  return SVGDefs().append(
    SVGMarker({
      id: id,
      bounds: rect2D(0, 0, 10 * scale, 10 * scale),
      refX: `${5 * scale}`,
      refY: `${5 * scale}`,
      markerWidth: 5 * scale, 
      markerHeight: 5 * scale,
    }).append(SVGCircle({ 
      cx: 5 * scale, 
      cy: 5 * scale, 
      r: 5 * scale, 
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
      fill: options.fill 
    }))
  );
}

