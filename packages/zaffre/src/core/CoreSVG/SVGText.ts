import { zstring, zget, SplitZPoint2D, ZType, zpoint2D, znumber } from ":foundation";
import { SVGViewCSSKeys, SVGViewSVGKeys } from "./SVG";
import { CreateSVGView } from "./SVGDelegate";
import { addClass, afterOptionsMerged, setInnerHTML } from ":view";
import { SVGOptions } from "./SVGOptions";
import { css_color, css_font, css_fontSize, css_userSelect } from ":attributes";

//
// SVGText is an SVG component containing text.
//
// TODO:
//  - sanitize?
//  - add SVGTextPath
//

export interface SVGTextOptions extends SVGOptions {
  x?: ZType<number | string>;
  y?: ZType<number | string>;
  point?: zpoint2D;
  dx?: znumber;
  dy?: znumber;
  rotate?: zstring;
  lengthAdjust?: zstring;
  textLength?: znumber;
  fontSize?: css_fontSize;
  font?: css_font;
  alignmentBaseline?: zstring; // not supported on Firefox
  dominantBaseline?: zstring;
  baselineShift?: number; // not supported on Firefox
  textAnchor?: zstring;
  stroke?: css_color;
  userSelect?: css_userSelect;
}


export const SVGText = (content: zstring, inOptions: SVGTextOptions = {}) => {
  const options = addClass(inOptions, "SVGText");
  
  afterOptionsMerged(options, () => {
    if (options.point) {
      [options.x, options.y] = SplitZPoint2D(options.point);
    }
  });

  options.onApplyContent = (view): void => {
    setInnerHTML(view, zget(content));
  };

  return CreateSVGView("text", SVGText.svgKeys, SVGText.cssKeys, options);
};
SVGText.cssKeys = [...SVGViewCSSKeys, "fontSize", "dominantBaseline", "baselineShift", "textAnchor", "stroke", "userSelect"];
SVGText.svgKeys = [...SVGViewSVGKeys, "x", "y", "dx", "dy", "rotate", "lengthAdjust", "textLength"];
