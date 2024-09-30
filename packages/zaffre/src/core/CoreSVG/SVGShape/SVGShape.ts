import { znumber } from ":foundation";
import { View } from ":view";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "../SVG";
import { SVGMarkerRef, SVGPaint } from "../../CoreOptions";
import { SVGOptions } from "../SVGOptions";
import { CreateSVGView } from "../SVGDelegate";

//
// Base class for SVG shape components
//  - SVGCircle
//  - SVGEllipse
//  - SVGLine
//  - SVGPath
//  - SVGPolygon
//  - SVGPolyline
//  - SVGRectangle

export interface SVGShapeOptions extends SVGOptions {
  pathLength?: znumber;
  stroke?: SVGPaint;
  strokeWidth?: znumber;
  strokeOpacity?: znumber;
  fillOpacity?: znumber;
  marker?: SVGMarkerRef;
  markerStart?: SVGMarkerRef;
  markerMid?: SVGMarkerRef;
  markerEnd?: SVGMarkerRef;
}
export function CreateShape(tagName: string, svgKeys: string[], cssKeys: string[], options: SVGShapeOptions = {}): View {
  options.tag = tagName;
  if (options.marker) {
    // expand marker shorthand
    options.markerStart = options.marker;
    options.markerMid = options.marker;
    options.markerEnd = options.marker;
  }
  return CreateSVGView(tagName, svgKeys, cssKeys, options);
}

export const SVGShapeCSSKeys = [...SVGViewCSSKeys, "stroke", "strokeWidth", "strokeOpacity", "fillOpacity", "markerStart", "markerMid", "markerEnd"];
export const SVGShapeSVGKeys = [...SVGViewSVGKeys, "pathLength"];
