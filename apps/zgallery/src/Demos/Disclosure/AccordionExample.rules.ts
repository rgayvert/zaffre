import { ch } from ":attributes";
import { zborder, zspace } from ":theme";
import { OptionRules } from ":view";

export const accordionListExampleRules: OptionRules = {
  "accordion-list-top": {
    padding: zspace.s5,
  },
  "accordion-list": {
    border: zborder.thin,
    width: ch(40),
    overflow: "hidden",
    allowMultipleExpansions: false,
  },
  "accordion-text": {
    padding: zspace.s3,
    borderTop: zborder.thin,
    overflow: "hidden",
  },
};
