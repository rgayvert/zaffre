import { BV, View, defineBaseOptions, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A CenterBox is used to position another component in the center of its parent,
// both vertically and horizontally.
//

export interface CenterBoxOptions extends BoxOptions {}

defineBaseOptions<CenterBoxOptions>("CenterBox", "Box", {
  display: "flex",
  flexWrap: "nowrap",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});


export function CenterBox(inOptions: BV<CenterBoxOptions> = {}): View {
  const options = mergeComponentOptions("CenterBox", inOptions);
  return Box(options);
}
