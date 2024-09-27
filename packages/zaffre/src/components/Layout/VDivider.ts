import { zstring } from ":foundation";
import { pct, px, View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A VDivider is intended for use inside an HStack to provide a visual separator.
//

export interface VDividerOptions extends BoxOptions {
  icon?: zstring;
}
defineComponentDefaults<VDividerOptions>("VDivider", "Box", {
  color: core.color.gray,
  marginInline: core.space.s5,
  width: px(1),
  height: pct(90),
});

export function VDivider(inOptions: VDividerOptions = {}): View {
  const options = mergeComponentDefaults("VDivider", inOptions);

  const outerOptions: VDividerOptions = {
    marginInline: options.margin,
    componentName: options.componentName,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "normal",
    justifyContent: "center",
  };
  const innerOptions = {
    background: options.color,
    width: options.width,
    height: options.height,
  };
  return Box(outerOptions).append(Box(innerOptions));
}
