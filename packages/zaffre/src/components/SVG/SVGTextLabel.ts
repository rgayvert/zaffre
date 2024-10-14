import { zget, zboolean, znumber, zstring, atom, rect2D } from ":foundation";
import { beforeAddedToDOM, standardSVGInteractionEffects, css_color, px, View, BV, restoreOptions } from ":core";
import { core, defineComponentBundle, mergeComponentOptions } from ":core";
import { SVG, SVGContainerOptions, SVGRectangle, SVGText } from ":core";

//
// An SVGTextLabel is similar to a standard TextLabel, but is implemented as an SVG container.
// An SVGBox is used for the border and background, and an SVGText for the text contents.
//
// TODO: eliminate vOffset
//

export interface SVGTextLabelOptions extends SVGContainerOptions {
  space?: znumber;
  rounded?: zboolean;
  ripple?: zboolean;
  textColor?: css_color;
  vOffset?: znumber;
}
defineComponentBundle<SVGTextLabelOptions>("SVGTextLabel", "", {
  bounds: rect2D(0, 0, 100, 100),
  textColor: core.color.primary,
  userSelect: "none",
});

export function SVGTextLabel(content: zstring, inOptions: BV<SVGTextLabelOptions> = {}): View {
  const options = mergeComponentOptions("SVGTextLabel", inOptions);

  beforeAddedToDOM(options, (view: View): void => {
    const viewOptions = <SVGTextLabelOptions>view.options;
    if (viewOptions.events) {
      viewOptions.effects = standardSVGInteractionEffects();
      const cursor = zget(viewOptions.cursor || "pointer");
      viewOptions.cursor = atom(() => (view.isEnabled() ? cursor : "default"));
    } else {
      viewOptions.cursor = undefined;
    }
  });

  return restoreOptions(
    SVG(options).append(
      SVGRectangle({
        id: "rect",
        x: 5,
        y: 5,
        width: 90,
        height: 90,
        strokeWidth: 1,
        stroke: core.color.secondary,
        fill: core.color.secondaryContainer,
        rx: options.rounded ? 20 : 0,
        ry: options.rounded ? 20 : 0,
      }),
      SVGText(content, {
        id: "text",
        stroke: core.color.primary,
        fill: options.textColor,
        fontSize: px(70),
        dominantBaseline: "middle",
        baselineShift: zget(options.vOffset) || 0,
        textAnchor: "middle",
        x: 50,
        y: 50,
        userSelect: "none",
      })
    )
  );
}
