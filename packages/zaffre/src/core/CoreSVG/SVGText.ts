import { ZType, znumber, zstring, zget, zpoint2D, SplitZPoint2D } from ":foundation";
import { css_color, css_font, css_fontSize, css_userSelect } from ":attributes";
import { CreateSVGView, SVGViewCSSKeys, SVGOptions, SVGViewSVGKeys } from "./SVG";
import { View } from ":view";

//
//
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
  //alignmentBaseline?: zstring;  // not support on Firefox
  dominantBaseline?: zstring;
  baselineShift?: number;         // not support on Firefox
  textAnchor?: zstring;
  stroke?: css_color;
  userSelect?: css_userSelect;
}

// TODO: sanitize

export function SVGText(content: zstring, options: SVGTextOptions): View {
  options.componentName = "SVGText";
  if (options.point) {
    [options.x, options.y] = SplitZPoint2D(options.point);
  }
  options.onGetContent = (): string => zget(content);
  options.onApplyContent = (view: View): void => {
    view.elt.innerHTML = zget(content);
  };

  return CreateSVGView("text", SVGText.svgKeys, SVGText.cssKeys, options);
}
SVGText.cssKeys = [...SVGViewCSSKeys, "fontSize", "dominantBaseline", "baselineShift", "textAnchor", "stroke", "userSelect"];
SVGText.svgKeys = [...SVGViewSVGKeys, "x", "y", "dx", "dy", "rotate", "lengthAdjust", "textLength"];