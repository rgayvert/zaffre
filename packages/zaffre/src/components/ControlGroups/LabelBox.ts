import { ZType, zget, zstring, atom, EdgePoint, BoxSide, zboolean } from ":foundation";
import { convertBoxSideToEdgePoint } from ":foundation";
import { CSSAlign, CSSFlexDirection, View, disableEffectsWhile } from ":core";
import { core, defineComponentDefaults, mergeComponentDefaults } from ":core";
import { TextLabel, TextLabelOptions } from "../Content";
import { Stack, StackOptions } from "../Layout";

//
// A LabelBox is a stack with a label. The position of the label can be specified
// simply with a side, or more generally with an edge point placement.
//
// A typical usage would be to label a control like this:
//       LabelBox("Name:").append(TextInput(...))
//
// The space between the label and the next component is set by the gap option.
// If a clickable child is added to a LabelBox, the text label will be given a
// click action to extend the child action to the label.
//

export interface LabelBoxOptions extends StackOptions {
  side?: BoxSide;
  placementPt?: ZType<EdgePoint>;
  extendClick?: zboolean;
  labelOptions?: TextLabelOptions;
}
defineComponentDefaults<LabelBoxOptions>("LabelBox", "Stack", {
  side: "left",
  justifyContent: "unset",
  extendClick: true,
  labelOptions: {
    font: core.font.label_large,
  },
});

function extractDirection(pt: EdgePoint): CSSFlexDirection {
  return pt.endsWith("center")
    ? pt.startsWith("xstart")
      ? "row"
      : "row-reverse"
    : pt.endsWith("start")
    ? "column"
    : "column-reverse";
}
function extractAlign(pt: EdgePoint): CSSAlign {
  return pt.endsWith("center")
    ? "center"
    : pt.startsWith("xstart")
    ? "start"
    : pt.startsWith("xend")
    ? "end"
    : "center";
}
export function LabelBox(label: zstring, inOptions: LabelBoxOptions = {}): View {
  const options = mergeComponentDefaults("LabelBox", inOptions);
  const pt = options.placementPt || convertBoxSideToEdgePoint(options.side!);
  const dir = atom(() => extractDirection(zget(pt)));
  const align = atom(() => extractAlign(zget(pt)));
  // make sure horizontal labels have some space
  options.gap ??= atom(() => (dir.get().startsWith("row") ? core.space.s2 : core.space.s0));

  const labelOptions = mergeComponentDefaults("TextLabel", options.labelOptions || {});
  const textLabel = TextLabel(label, labelOptions);

  if (zget(options.extendClick)) {
    options.afterAppendChild = (view, child): void => {
      if (child.handlesClickEvent()) {
        textLabel.options.clickAction = (): void => disableEffectsWhile(() => child.click());
      }
    };
  }

  return Stack({
    ...options,
    flexDirection: dir,
    alignItems: align,
  }).append(textLabel);
}