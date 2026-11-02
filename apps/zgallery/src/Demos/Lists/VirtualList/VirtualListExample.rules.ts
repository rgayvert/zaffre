import { px } from ":attributes";
import { zborder, zcolor, zfont, zspace } from ":theme";

export const virtualListExampleRules = {
  "VStack": {
    paddingInline: zspace.s2,
    alignItems: "start",
    justifyContent: "start",
    overflowY: "scroll",
    //width: px(100),
    height: px(200),
    border: zborder.thin,
  },
  "TextLabel": {
    font: zfont.body_small,
    selectionColor: zcolor.secondaryContainer,
  },
};
