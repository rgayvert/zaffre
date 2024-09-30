import { rect2D, znumber } from ":foundation";
import { View } from ":view";
import { css_color } from ":attributes";
import { SVGCircle } from "../SVGShape";
import { SVGPaint } from "../../CoreOptions";
import { SVGMarker, SVGMarkerOptions } from "./SVGMarker";

//
// An SVGDot is a marker that displays a circle.
//

export interface SVGDotOptions extends SVGMarkerOptions {
  fill?: SVGPaint;
  scale?: number;
  stroke?: css_color;
  strokeWidth?: znumber;
}

export function SVGDot(options: SVGDotOptions = {}): View {
  const scale = options.scale || 1.0;

  return SVGMarker({
    bounds: rect2D(0, 0, 10 * scale, 10 * scale),
    refX: `${5 * scale}`,
    refY: `${5 * scale}`,
    markerWidth: 5 * scale,
    markerHeight: 5 * scale,
  }).append(
    SVGCircle({
      cx: 5 * scale,
      cy: 5 * scale,
      r: 5 * scale,
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
      fill: options.fill,
    })
  );
}
