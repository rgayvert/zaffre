import { zstring, rect2D, PickList } from ":foundation";
import { px, SVGCircle, rectToken, pct, addClass, SVGContainerOptions, css_color, css_font } from ":core";
import { SVG, SVGRectangle, SVGText } from ":core";

//
// SVGAvatar
//

export interface SVGAvatarOptions extends SVGContainerOptions {
  circular?: boolean;
  size?: number;
  bgColor?: css_color;
  textColor?: css_color;
  font?: css_font;
  menuPickList?: PickList<any>;
}

export const SVGAvatar = (title: zstring, inOptions: SVGAvatarOptions = {}) => {
  const options = addClass(inOptions, "SVGAvatar");

  const sz = options.size || 64;
  options.width ??= pct(100);
  options.height ??= pct(100);
  options.viewBox = rectToken(rect2D(0, 0, sz, sz));

  return SVG(options).append(
    options.circular
      ? SVGCircle({
          cx: sz / 2,
          cy: sz / 2,
          r: sz / 2,
          fill: options.bgColor,
        })
      : SVGRectangle({
          x: 0,
          y: 0,
          width: sz,
          height: sz,
          fill: options.bgColor,
        }),
    SVGText(title, {
      x: sz / 2,
      y: sz / 2 + 2,
      stroke: options.textColor,
      fill: options.textColor,
      fontSize: px(32),
      dominantBaseline: "middle",
      textAnchor: "middle",
    })
  );
};
