import { zstring } from ":foundation";
import { css_cursor, css_display, css_clipPath, css_color } from "../Attributes";

//
//
//

export type svg_dasharray = string;
export type svg_dashoffset = string;

export type SVGStrokeLinecap = "butt" | "round" | "square";
export type SVGStrokeLinejoin = "miter" | "round" | "bevel" | "miter-clip" | "arcs" ;
export type SVGStrokeDasharray = svg_dasharray;
export type SVGStrokeDashoffset = svg_dashoffset;
export type SVGGradientUnits = "userSpaceOnUse" | "objectBoundingBox";
export type SVGSpreadMethod = "pad" | "reflect" | "repeat";

type url_string = string;

export type SVGPaint = css_color | "context-fill" | "context-stroke" | "none" | url_string;

export type SVGMarkerRef = zstring; // "url(#[def id])"

/*

Animation elements
  animate, animateMotion, animateTransform, mpath, set
Container elements
  a, defs, g, marker, mask, missing-glyph, pattern, svg, switch, symbol
Descriptive elements
  desc, metadata, title
Filter primitive elements
  feBlend, feColorMatrix, feComponentTransfer, feComposite, feConvolveMatrix, feDiffuseLighting, feDisplacementMap, feDropShadow, feFlood, feFuncA, feFuncB, feFuncG, feFuncR, feGaussianBlur, feImage, feMerge, feMergeNode, feMorphology, feOffset, feSpecularLighting, feTile, feTurbulence
Font elements
  font, font-face, font-face-format, font-face-name, font-face-src, font-face-uri, hkern, vkern
Gradient elements
  linearGradient, radialGradient, stop
Graphics elements
  circle, ellipse, image, line, path, polygon, polyline, rect, text, use
Graphics referencing elements
  use
Light source elements
  feDistantLight, fePointLight, feSpotLight
Never-rendered elements
  clipPath, defs, hatch, linearGradient, marker, mask, metadata, pattern, radialGradient, script, style, symbol, title
Paint server elements
  hatch, linearGradient, pattern, radialGradient, solidcolor
Renderable elements
  a, circle, ellipse, foreignObject, g, image, line, path, polygon, polyline, rect, svg, switch, symbol, text, textPath, tspan, use
Shape elements
  circle, ellipse, line, path, polygon, polyline, rect
Structural elements
  defs, g, svg, symbol, use
Text content elements
  glyph, glyphRef, textPath, text, tref, tspan
Text content child elements
  textPath, tref, tspan
Uncategorized elements
  clipPath, cursor, filter, foreignObject, hatchpath, script, style, view

*/

export interface SVGPresentationOptions {
  clipPath?: css_clipPath;
  color?: css_color;
  cursor?: css_cursor;
  //    "direction",
  display?: css_display;

}

export const SVGPresentationOptionKeys = [
    "clipPath",
    "color",
    "cursor",
    "direction",
    "display",
    "filter",
    "fontFamily",
    "fontSize",
    "fontSizeAdjust",
    "fontStretch",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "imageRendering",
    "letterSpacing",
    "mask",
    "opacity",
    "overflow",
    "pointerEvents",
    "textDecoration",
    "textRendering",
    "transform",
    "transition",
    "unicodeBidi",
    "visibility",
    "wordSpacing",
    "writingMode",
  ];
  
  
  export const all_SVGPresentationOptionKeys = [
    "alignmentBaseline",              // not supported by Firebox - use dominantBaseline
    "clipRule",                       // graphical elements
    "colorInterpolation",
    "colorInterpolationFilters",
    "d",                              // not supported by Safari as presentation attributes
    "dominantBaseline",
    "fill",
    "fillOpacity",
    "fillRule",
    "floodColor",
    "floodOpacity",
    "lightingColor",
    "markerEnd",
    "markerMid",
    "markerStart",
    "shapeRendering",
    "stopColor",
    "stopOpacity",
    "stroke",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeOpacity",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
    "textAnchor",
    "vectorEffect",
    "visibility",
  ];
  
  