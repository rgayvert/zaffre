import { Box } from "../HTML";
import { ZStack } from "./ZStack";
import { addClass } from ":view";
import { ZStackOptions } from "./ZStack";

export interface ElevatedBoxOptions extends ZStackOptions {}


export const ElevatedBox = (inOptions: ElevatedBoxOptions = {}) => {
  const options = addClass(inOptions, "ElevatedBox");

  return ZStack(options).append(Box({ cls: "ElevatedBox.Underlay" }));
};
