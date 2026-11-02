import { addClass } from ":view";
import { Box, BoxOptions } from "../HTML";

//
// A CenterBox is used to position another component in the center of its parent,
// both vertically and horizontally.
//

export interface CenterBoxOptions extends BoxOptions {}

export const CenterBox = (inOptions: CenterBoxOptions = {}) => {
  const options = addClass(inOptions, "CenterBox");

  options.display = "flex";
  options.flexWrap = "nowrap";
  options.flexDirection = "column";
  options.alignItems = "center";
  options.justifyContent = "center";

  return Box(options);
};
