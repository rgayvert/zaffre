import { atom, Button, Spacer, LabelBox, edgePointNames, ListBox, pickList, EdgePoint } from "zaffre";
import { Placement, HStack } from "zaffre";
import { tooltipPlacementExampleRules } from "./TooltipPlacementExample.rules";


export const TooltipPlacementExample = () => {
  const refList = pickList([<EdgePoint>"xcenter-yend"], edgePointNames().sort());
  const tooltip = atom<string>(() => refList.lastSelection.get() || "");
  const place = atom<Placement>(() => ({ referencePt: refList.lastSelection.get() || "xcenter-yend", side: "outside" }));

  return HStack({ cls: "example-top", rules: tooltipPlacementExampleRules(tooltip, place) }).append(
    Spacer("s4"),
    LabelBox("Placement").append(
      ListBox(refList),
    ),
    Button({ cls: "hover-button"}),
  );
}
