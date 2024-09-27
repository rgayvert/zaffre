import { znumber } from ":foundation";
import { View, css_space, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Spacer is a simple box that is intended for use inside a Stack. If the value provided is
// a space value (e.g., core.space.s2), it becomes a square with that size. If the value is a number
// it become a box with flexgrow, so it divides up the available space.
//


export interface SpacerOptions extends BoxOptions {
  grow?: znumber;
  space?: css_space;
}
defineComponentDefaults<SpacerOptions>("Spacer", "Box", {
  background: core.color.transparent,
});

export function Spacer(growOrSpace?: css_space | number, inOptions: SpacerOptions = {}): View {
  const options = mergeComponentDefaults("Spacer", inOptions);

  if (typeof growOrSpace === "number") {
    options.width = core.space.s1;
    options.height = core.space.s1;
    options.flexGrow = growOrSpace;
  } else {
    options.width = growOrSpace;
    options.height = growOrSpace;
  }
  return Box(options);
}