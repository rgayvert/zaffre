import { zborder, zcolor, zfont, zspace } from ":theme";
import { OptionRules } from ":view";

export const iconLabelExampleRules: OptionRules = {
  "icon-label-example": {
    alignItems: "center",
    gap: zspace.s8,
  },
  "icon-label-1": {
    gap: zspace.s2,
    font: zfont.headline_large,
    color: zcolor.green
  },
  "icon-label-2": {
    gap: zspace.s5,
    font: zfont.label_medium,
    border: zborder.thin,
  },
  "icon-label-icon": {},
};
