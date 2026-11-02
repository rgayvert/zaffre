import { addClass, View } from ":view";
import { Stack } from "./Stack";
import { LogicalPosition, LogicalSide, zget, ZType } from ":foundation";
import { StackOptions } from "./Stack";

//
// PlacedPair
//

export interface PlacedPairOptions extends StackOptions {}

export type PlacedPairSide = "top" | "right" | "bottom" | "left";
export type PlacedPairPosition = "start" | "center" | "end";

export const PlacedPair = (
  v1: View,
  v2: View,
  side: ZType<LogicalSide | null>,
  position: ZType<LogicalPosition | null>,
  inOptions: PlacedPairOptions = {}
) => {
  const options = addClass(inOptions, "PlacedPair");

  options.flexDirection = () => 
    zget(side) == "ystart"
      ? "column-reverse"
      : zget(side) === "xend"
      ? "row"
      : zget(side) === "yend"
      ? "column"
      : "row-reverse";

  options.alignItems = () => zget(position) || "start";
  
  return Stack(options).append(v1, v2);
};
