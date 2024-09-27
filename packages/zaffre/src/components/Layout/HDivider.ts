import { zstring } from ":foundation";
import { calc, em, pct, px, View } from ":core";
import { core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";
import { Icon } from "../Content";

//
// An HDivider is intended for use inside a VStack to provide a visual separator.
//

export interface HDividerOptions extends BoxOptions {
  iconName?: zstring;
}
defineComponentDefaults<HDividerOptions>("HDivider", "Box", {
  color: core.color.gray,
  margin: core.space.s5,
  width: pct(90),
  height: px(1),
});

export function HDivider(inOptions: HDividerOptions = {}): View {
  const options = mergeComponentDefaults("HDivider", inOptions);

  const outerOptions = <HDividerOptions>{
    marginTop: options.margin,
    marginBottom: options.margin,
    width: pct(100),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    componentName: options.componentName,
  };
  const innerOptions = {
    background: options.color,
    width: options.width,
    height: options.height,
  };
  let icon;
  if (options.iconName) {
    icon = Icon(options.iconName, {
      position: "absolute",
      left: calc("50% - 0.5ch"),
      top: em(-0.5),
    });
  }
  return Box(outerOptions).append(Box(innerOptions), icon);
}
