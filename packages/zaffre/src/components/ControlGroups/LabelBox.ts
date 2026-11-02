import { zget, zstring, EdgePoint, convertBoxSideToEdgePoint, atom, BoxSide, ZType, zboolean } from ":foundation";
import { zspace, CSSAlign, CSSFlexDirection, addClass, afterOptionsMerged } from ":core";
import { TextLabel } from "../Content";
import { Stack, StackOptions } from "../Layout";

//
// A LabelBox is a stack with a label. The position of the label can be specified
// simply with a side, or more generally with an edge point placement.
//
// A typical usage would be to label a control like this:
//       LabelBox("Name:").append(TextInput(...))
//
// The space between the label and the next component is set by the gap option.
// If a clickable child is added to a LabelBox, the label will be given a
// click action to extend the child action to the label.
//

export interface LabelBoxOptions extends StackOptions {
  side?: BoxSide;
  placementPt?: ZType<EdgePoint>;
  extendClick?: zboolean;
}

const extractDirection = (pt: EdgePoint): CSSFlexDirection => {
  return pt.endsWith("center") ? (pt.startsWith("xstart") ? "row" : "row-reverse") : pt.endsWith("start") ? "column" : "column-reverse";
};
const extractAlign = (pt: EdgePoint): CSSAlign => {
  return pt.endsWith("center") ? "center" : pt.startsWith("xstart") ? "start" : pt.startsWith("xend") ? "end" : "center";
};

export const LabelBox = (labelString: zstring, inOptions: LabelBoxOptions = {}) => {
  const options = addClass(inOptions, "LabelBox");
  options.model = labelString;

  afterOptionsMerged(options, (view) => {
    const label = TextLabel(labelString, {
      cls: "LabelBox.TextLabel",
      events: {
        // make the label respond to a click if the other child does
        click: (evt: MouseEvent) => {
          const action = view.children.at(1)?.options.events?.click;
          if (action && !Array.isArray(action)) {
            action(evt);
          }
        },
      },
    });

    const pt = options.placementPt || convertBoxSideToEdgePoint(options.side!);
    const dir = atom(() => extractDirection(zget(pt)));
    options.flexDirection = dir;
    options.alignItems = atom(() => extractAlign(zget(pt)));

    // make sure horizontal labels have some space
    options.gap ??= atom(() => (dir.get()?.startsWith("row") ? zspace.s2 : zspace.s0));

    // ensure label is first child
    view.prepend(label);
  });
  
  return Stack(options);
};
