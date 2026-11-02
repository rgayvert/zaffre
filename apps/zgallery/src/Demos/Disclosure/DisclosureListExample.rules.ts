import { ch } from ":attributes";
import { zborder, zspace } from ":theme";
import { OptionRules } from ":view";

export const disclosureListExampleRules: OptionRules = {
  "disclosure-list-example": {
    padding: zspace.s5 
  },
  "disclosure-list": {
    border: zborder.thin,
    width: ch(40),
    overflow: "hidden",
  },
  "disclosure-text": {
    padding: zspace.s3,
    borderTop: zborder.thin,
    overflow: "hidden",
  },
};
