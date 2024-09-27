import { View, core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { Box, BoxOptions } from "../HTML";

//
// A Stack is just a non-wrapping flex box. 
//

export type StackOrientation = "vertical" | "horizontal";

export interface StackOptions extends BoxOptions {}

defineComponentDefaults<StackOptions>("Stack", "Box", {
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  justifyContent: "center",
  background: core.color.background,
});

export function Stack(inOptions: StackOptions = {}): View {
  const options = mergeComponentDefaults("Stack", inOptions);
  return Box(options);
}

///////////////////////////////////////////////////////////////////////////////////////////////

defineComponentDefaults<StackOptions>("HStack", "Stack", {
  flexDirection: "row",
});

export function HStack(inOptions: StackOptions = {}): View {
  const options = mergeComponentDefaults("HStack", inOptions);
  return Stack(options);
}

///////////////////////////////////////////////////////////////////////////////////////////////

defineComponentDefaults<StackOptions>("VStack", "Stack", {
  flexDirection: "column",
});

export function VStack(inOptions: StackOptions = {}): View {
  const options = mergeComponentDefaults("VStack", inOptions);
  return Stack(options);
}
