import { BV, View, core, defineComponentBundle, mergeComponentOptions, restoreOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Stack is just a non-wrapping flex box.
//

export type StackOrientation = "vertical" | "horizontal";

export interface StackOptions extends BoxOptions {}

defineComponentBundle<StackOptions>("Stack", "Box", {
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "center",
  background: core.color.background,
});

export function Stack(inOptions: BV<StackOptions> = {}): View {
  const options = mergeComponentOptions("Stack", inOptions);
  return restoreOptions(Box(options));
}

// export function StackX(): View {
//   return Box()
//     .display("flex")
//     .flexWrap("nowrap")
//     .alignItems("center")
//     .justifyContent("center")
//     .background(core.color.background);
// }

///////////////////////////////////////////////////////////////////////////////////////////////

defineComponentBundle<StackOptions>("HStack", "Stack", {
  flexDirection: "row",
});

export function HStack(inOptions: BV<StackOptions> = {}): View {
  const options = mergeComponentOptions("HStack", inOptions);
  return restoreOptions(Stack(options));
}

///////////////////////////////////////////////////////////////////////////////////////////////

defineComponentBundle<StackOptions>("VStack", "Stack", {
  flexDirection: "column",
});

export function VStack(inOptions: BV<StackOptions> = {}): View {
  const options = mergeComponentOptions("VStack", inOptions);
  return restoreOptions(Stack(options));
}
