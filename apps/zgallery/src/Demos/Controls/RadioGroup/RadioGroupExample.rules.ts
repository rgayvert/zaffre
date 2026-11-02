import {zfont, zspace } from "zaffre";

export const radioGroupExampleRules = {
  "HStack": {
    gap: zspace.s8,
  },
  "TextLabel": {
    padding: zspace.s2,
    font: zfont.body_small,
  },
  "radio2": {
    flexDirection: "row",
    gap: zspace.s5,
  },
  "radio2>RadioButton": {
    onIcon: "icon.square-box-filled",
    offIcon: "icon.square-box-outlined",
  },
};
 