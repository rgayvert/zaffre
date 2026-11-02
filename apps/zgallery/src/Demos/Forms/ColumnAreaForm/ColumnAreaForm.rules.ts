import { zborder, zcolor, zfont, zspace, OptionRules, zrounding, SegmentedButtonOptions } from "zaffre";

export const columnAreaFormRules: OptionRules = {
  "SegmentedButton": {
    rounding: zrounding.r1,
    border: zborder.thin.color(zcolor.primary.opacity(0.4)),
  } satisfies SegmentedButtonOptions<any>,

};
 