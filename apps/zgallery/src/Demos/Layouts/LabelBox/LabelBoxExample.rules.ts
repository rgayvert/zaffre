import { ch, em, zborder, zcolor, zfont, zspace } from "zaffre";

export const labelBoxExampleRules = {
  "container": {
    gap: zspace.s5,
  },
  "row1": {
    gap: zspace.s8,
    border: zborder.thin,
    padding: zspace.s3,
  },
  "row2": {
    gap: zspace.s3,
  },
  "content-box": {
    background: zcolor.primary,
    width: ch(20),
    height: em(2),
  },
  "labelbox-label": {
    color: zcolor.red,
    font: zfont.body_medium.bold(),
  },
};
