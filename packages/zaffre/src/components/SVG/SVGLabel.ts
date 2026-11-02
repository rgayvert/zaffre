import { zget, zstring, atom, znumber, zboolean } from ":foundation";
import { beforeAddedToDOM, standardSVGInteractionEffects, px, addClass, css_color, SVGContainerOptions } from ":core";
import { zcolor, SVG, SVGRectangle, SVGText } from ":core";

//
// An SVGLabel is similar to a standard TextLabel, but is implemented as an SVG container.
// An SVGBox is used for the border and background, and an SVGText for the text contents.
//
// TODO: eliminate vOffset
//

export interface SVGLabelOptions extends SVGContainerOptions {
  space?: znumber;
  rounded?: zboolean;
  ripple?: zboolean;
  textColor?: css_color;
  vOffset?: znumber;
}


export const SVGLabel = (content: zstring, inOptions: SVGLabelOptions = {}) => {
  const options = addClass(inOptions, "SVGLabel");

  beforeAddedToDOM(options, (view): void => {
    const viewOptions = <SVGLabelOptions>view.options;
    if (viewOptions.events) {
      viewOptions.effects = standardSVGInteractionEffects();
      const cursor = zget(viewOptions.cursor || "pointer");
      viewOptions.cursor = atom(() => (view.isEnabled() ? cursor : "default"));
    } else {
      viewOptions.cursor = undefined;
    }
  });

  return SVG(options).append(
    SVGRectangle({
      id: "rect",
      cls: "rect",
      x: 5,
      y: 5,
      width: 90,
      height: 90,
      strokeWidth: 1,
      stroke: zcolor.secondary,
      fill: zcolor.secondaryContainer,
      rx: () => (options.rounded ? 20 : 0),
      ry: () => (options.rounded ? 20 : 0),
    }),
    SVGText(content, {
      id: "text",
      stroke: zcolor.primary,
      fill: options.textColor,
      fontSize: px(70),
      dominantBaseline: "middle",
      baselineShift: zget(options.vOffset) || 0,
      textAnchor: "middle",
      x: 50,
      y: 50,
      userSelect: "none",
    })
  );
};
