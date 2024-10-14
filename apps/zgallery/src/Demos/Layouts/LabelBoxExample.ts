import { View, core, atom, DropDownButton, LabelBox, EdgePoint } from "zaffre";
import { HStack, zlog, VStack, Checkbox } from "zaffre";
import { Box, ch, em, edgePointNames, TextLabelOptions } from "zaffre";


export function LabelBoxExample(): View {
  const refPt = atom(<EdgePoint>"xstart-ystart", { action: (val) => zlog.info(val) });
  const content = Box({ background: core.color.primary, width: ch(20), height: em(2) });
  const checkboxValue = atom(false);
  const labelOptions: TextLabelOptions = {
    color: core.color.tertiary,
    font: core.font.label_small.bold(),
  };

  return VStack("gap-5").append(
    HStack(["gap-8", "b1", "pad-3"]).append(
      LabelBox("Placement:").append(DropDownButton(refPt, edgePointNames())),
      LabelBox("Label", { placementPt: refPt, textLabelOptions: labelOptions }).append(content)
    ),
    HStack("s3").append(LabelBox("Click me:").append(Checkbox(checkboxValue)))
  );
}
