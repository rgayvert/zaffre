import { addClass } from ":view";
import { Box, BoxOptions } from "../HTML";
import { zstring } from ":foundation";

//
// A VDivider is intended for use inside an HStack to provide a visual separator.
//

export interface VDividerOptions extends BoxOptions {
  icon?: zstring;
}

export const VDivider = (inOptions: VDividerOptions = {}) => {
  const options = addClass(inOptions, "VDivider");

  const outerOptions: VDividerOptions = {
    marginInline: options.margin,
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
};
