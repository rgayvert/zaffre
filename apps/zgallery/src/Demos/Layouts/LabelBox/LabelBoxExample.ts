import { atom, DropDownButton, LabelBox, EdgePoint, pickList, simpleMenuItemList } from "zaffre";
import { HStack, zlog, VStack, Checkbox } from "zaffre";
import { Box, edgePointNames } from "zaffre";
import { labelBoxExampleRules } from "./LabelBoxExample.rules";

export const LabelBoxExample = () => {
  const selectedRefPt = atom(<EdgePoint>"xstart-ystart");
  const refPtList = simpleMenuItemList(edgePointNames(), selectedRefPt); 
  refPtList.addAction((val) => zlog.info(val));
  const content = Box({ cls: "content-box" });
  const checkboxValue = atom(false);

  return VStack({ rules: labelBoxExampleRules, cls: "container" }).append(
    HStack({ cls: "row1" }).append(
      LabelBox("Placement:").append(DropDownButton(refPtList)),
      LabelBox("TextLabel", { placementPt: () => selectedRefPt.get() }).append(content)
    ),
    HStack({ cls: "row2" }).append(LabelBox("Click me:").append(Checkbox(checkboxValue)))
  );
};
