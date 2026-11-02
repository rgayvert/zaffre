import { ch, zfont, zspace } from "zaffre";

export const checkboxExampleRules = {
  "container": {
    gap: zspace.s5,
  },
  "labelbox": {
    side: "right",
    gap: zspace.s1,
  },
  "Checkbox": {
    font: zfont.body_medium,
  },
  "result": {
    padding: zspace.s2,
    font: zfont.body_small,
    minWidth: ch(18),
  },

  "labelbox-label": {
    font: zfont.body_medium,
  },
};
