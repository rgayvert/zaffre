import { Spacer, LabelBox, Box, LogicalPositions, pickList, LogicalSide, LogicalPosition } from "zaffre";
import { LogicalSides, PlacedPair, ListBox, HStack } from "zaffre";
import { placedPairRules } from "./PlacedPairExample.rules";

export const PlacedPairExample = () => {
  const side = pickList<LogicalSide>(["xstart"], [...LogicalSides]);
  const position = pickList<LogicalPosition>(["start"], [...LogicalPositions]);

  return HStack({ cls: "example-top", rules: placedPairRules(side) }).append(
    Spacer("s4"),
    LabelBox("Side").append(ListBox(side)),
    LabelBox("Position").append(ListBox(position)),
    PlacedPair(
      Box({ cls: "main-box" }),
      Box({ cls: "toolbar-box" }),
      side.lastSelection,
      position.lastSelection
    )
  );
};
