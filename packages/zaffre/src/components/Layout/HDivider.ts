import { addClass, afterOptionsMerged, calc, css_margin, em, pct, zcolor } from ":core";
import { Box, BoxOptions } from "../HTML";
import { Icon } from "../Content";
import { HStack } from "./Stack";
import { zstring } from ":foundation";

//
// An HDivider is intended for use inside a VStack to provide a visual separator.
//
// An icon may be displayed in the middle of the divider.
//

export interface HDividerOptions extends BoxOptions {
  iconName?: zstring;
  thickness?: css_margin;
}

export const HDivider = (inOptions: HDividerOptions = {}) => {
  // TODO
  const options = addClass(inOptions, "HDivider");

  afterOptionsMerged(options, () => {
    options.marginBlock = <css_margin>options.height;
  });

  const outerOptions: BoxOptions = {
    background: zcolor.gray,
    marginTop: options.margin,
    marginBottom: options.margin,
    width: pct(100),
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  } satisfies HDividerOptions;

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

  return HStack(options).append(Box(innerOptions), icon);
};
