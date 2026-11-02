import { HStack, atom, SegmentedButton, TextLabel, pickList, pickOne } from "zaffre";
import { segmentedButtonExampleRules } from "./SegmentedButtonExample.rules";

export const SegmentedButtonExample = () => {
  const labels = ["Option A", "Option B", "Option C", "Option D"];
  const selection = atom("B");
  //const segmentList = pickList(["B"], ["A", "B", "C", "D"], { labels: labels });
  //const result = atom(() => `Selection: ${segmentList.selection}`)
  const segmentList = pickOne(selection, ["A", "B", "C", "D"], { labels: labels });
  const result = atom(() => `Selection: ${selection.get()}`)

  return HStack({ rules: segmentedButtonExampleRules }).append(
    SegmentedButton(segmentList, { 
      disabledValues: () => segmentList.selectedValue() === "A" ? ["D"] : [],
    }),
    TextLabel(result),

  );
}
