import { BV, View, core, defineBaseOptions, mergeComponentOptions } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Stack is just a non-wrapping flex box. 
//

export type StackOrientation = "vertical" | "horizontal";

export interface StackOptions extends BoxOptions {}

defineBaseOptions<StackOptions>("Stack", "Box", {
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "center",
  background: core.color.background,
});

export function Stack(inOptions: BV<StackOptions> = {}): View {
  const options = mergeComponentOptions("Stack", inOptions);
  return Box(options);
}

///////////////////////////////////////////////////////////////////////////////////////////////

defineBaseOptions<StackOptions>("HStack", "Stack", {
  flexDirection: "row",
});

export function HStack(inOptions: BV<StackOptions> = {}): View {
  const options = mergeComponentOptions("HStack", inOptions);
  return Stack(options);
}

///////////////////////////////////////////////////////////////////////////////////////////////

defineBaseOptions<StackOptions>("VStack", "Stack", {
  flexDirection: "column",
});

export function VStack(inOptions: BV<StackOptions> = {}): View {
  const options = mergeComponentOptions("VStack", inOptions);
  return Stack(options);
}
