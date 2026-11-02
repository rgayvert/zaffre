import { addClass } from ":view";
import { Box, BoxOptions } from "../HTML";

export interface BorderedShapeOptions extends BoxOptions {}

export const BorderedShape = (inOptions: BorderedShapeOptions = {}) => {
  const options = addClass(inOptions, "BorderedShape");

  return Box(options).append(Box({ cls: "underlay" }));
};
