import { View, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A CenterBox is used to position another component in the center of its parent,
// both vertically and horizontally.
//

export interface CenterBoxOptions extends BoxOptions {}

defineComponentDefaults<CenterBoxOptions>("CenterBox", "Box", {
  display: "flex",
  flexWrap: "nowrap",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});


export function CenterBox(inOptions: CenterBoxOptions = {}): View {
  const options = mergeComponentDefaults("CenterBox", inOptions);
  return Box(options);
}
