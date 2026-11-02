import { em, px } from ":attributes";
import { zcolor, zfont, zspace } from ":theme";
import { Atom, PickList, LogicalSide } from ":foundation";

const startWithX = (val: LogicalSide | null) => val && val.startsWith("x");

export const placedPairRules = (side: PickList<LogicalSide>) => {
  return {
    "example-top": {
      gap: zspace.s8,
      alignItems: "center",
    },
    "labelbox": {
      side: "top",
    },
    "ListBox": {
      font: zfont.body_medium,
      maxHeight: em(7),
      overflowY: "auto",
    },
    "ListBox>TextLabel": {
      padding: zspace.none,
      paddingInline: zspace.s2,
    },
    "main-box": {
      width: px(200),
      height: px(200),
      background: zcolor.green,
    },
    "toolbar-box": {
      width: () => startWithX(side.lastSelection.get()) ? px(30) : px(100),
      height: () => startWithX(side.lastSelection.get()) ? px(100) : px(30),
      background: zcolor.red,
    },
  };
};
