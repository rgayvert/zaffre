import { Box, BoxOptions } from "../HTML";
import { addClass } from ":view";

//
// A Stack is just a non-wrapping flex box.
//

export type StackOrientation = "vertical" | "horizontal";

export interface StackOptions extends BoxOptions {}


export const Stack = (inOptions: StackOptions = {}) => {
  const options = addClass(inOptions, "Stack");
  options.display = "flex";
  return Box(options);
};

export const HStack = (inOptions: StackOptions = {}) => {
  const options = addClass(inOptions, "HStack");
  options.flexDirection = "row";
  return Stack(options);
};

export const VStack = (inOptions: StackOptions = {}) => {
  const options = addClass(inOptions, "VStack");
  options.flexDirection = "column";
  return Stack(options);
};
