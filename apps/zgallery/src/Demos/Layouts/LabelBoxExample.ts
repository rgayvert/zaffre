import { View, core, atom, DropDownButton, Spacer, LabelBox, EdgePoint, HStack, zlog } from "zaffre";
import { Box, ch, em, edgePointNames, TextLabelOptions } from "zaffre";

export function LabelBoxExample(): View {
  const refPt = atom(<EdgePoint>"xstart-ystart", { action: (val) => zlog.info(val) });
  const content = Box({ background: core.color.primary, width: ch(20), height: em(2) });
  const labelOptions: TextLabelOptions = {
    color: core.color.tertiary,
    font: core.font.label_small.bold(),
  };

  return HStack().append(
    LabelBox("Placement:").append(DropDownButton(refPt, edgePointNames())),
    Spacer(core.space.s8),
    LabelBox("Label", { placementPt: refPt, labelOptions: labelOptions }).append(content)
  );
}
