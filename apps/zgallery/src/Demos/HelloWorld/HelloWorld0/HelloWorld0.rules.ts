import { zborder, zcolor, zfont, zspace, OptionRules } from "zaffre";

export const helloWorld0Rules: OptionRules = {
  "box": {
    background: zcolor.primaryContainer,
    padding: zspace.s3,
    border: zborder.thick.color(zcolor.green),
  },
  "TextLabel": {
    font: zfont.headline_small,
    color: zcolor.red,
    border: zborder.none,
  },
};
