import { View, core, atom, Button, Spacer, LabelBox, edgePointNames } from "zaffre";
import { Placement, EdgePoint, HStack, StringListBox, SelectionListOptions, em } from "zaffre";

export function TooltipPlacementExample(): View {
  const refPt = atom(<EdgePoint>"xcenter-yend");
  const tooltip = atom<string>(() => refPt.get());
  const place = atom<Placement>(() => ({ referencePt: refPt.get(), side: "outside" }));
  const listOptions: SelectionListOptions = {
    padding: core.space.s2,
    font: core.font.body_medium,
    maxHeight: em(7),
    overflowY: "scroll"
  };
  return HStack({ gap: core.space.s9, alignItems: "center" }).append(
    Spacer(core.space.s4),
    LabelBox("Placement", { side: "top" }).append(
      StringListBox(edgePointNames().sort(), refPt, listOptions),
    ),
    Button({
      label: "Hover to see Tooltip",
      tooltip: tooltip,
      tooltipPlacement: place,
    }),
  );
}
