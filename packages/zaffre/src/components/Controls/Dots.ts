import { ZType, atom, zboolean, zget } from ":foundation";
import { ColorToken, ch, css_length, em, View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Stack, StackOptions, ViewList } from "../Layout";
import { Box, BoxOptions } from "../HTML";

//
// A Dots component is a stack of simple shapes that are open or filled.
// Which shapes are filled is determined by an array of boolean values.
// For a carousel, this array will have only one value set to true. For a
// gauge style, the array would be filled in up to a particular index.
//
// TODO: allow Dots to be interactive
//

interface DotsOptions extends StackOptions {
  spaceBetweenDots?: css_length;
  dotOptions?: DotOptions;
  dotCreator?: (index: number, value: zboolean, options: DotOptions) => View;
}
interface DotOptions extends BoxOptions {
  shape?: "square" | "circle";
  dotSize?: css_length;
  dotColor?: ColorToken;
}
defineComponentDefaults<DotsOptions>("Dots", "StackOptions", {
  flexDirection: "row",
  spaceBetweenDots: ch(1),
});
function DefaultDot(_index: number, value: zboolean, options: DotOptions): View {
  const color = options.dotColor || core.color.primary;
  const sz = options.dotSize || em(0.5);
  const shape = options.shape || "circle";
  return Box({
    width: sz,
    height: sz,
    border: core.border.thin.color(color),
    background: atom(() => (zget(value) ? color : core.color.inherit)),
    rounding: shape === "circle" ? core.rounding.circle : core.rounding.r0,
  });
}

export function Dots(values: ZType<boolean[]>, inOptions: DotsOptions = {}): View {
  const options = mergeComponentDefaults("Dots", inOptions);
  options.gap = options.spaceBetweenDots;
  const dotCreator = options.dotCreator || DefaultDot;
  return Stack(options).append(
    ViewList(
      values,
      (_val, index) => index,
      (_val, index) =>
        dotCreator(
          index,
          atom(() => zget(values)[index]),
          options.dotOptions || {}
        )
    )
  );
}
