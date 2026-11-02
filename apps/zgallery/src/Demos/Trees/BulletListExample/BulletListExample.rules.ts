import { ch } from ":attributes";
import { zcolor } from ":theme";
import { OptionRules } from ":view";

export const bulletListExampleRules: OptionRules = {
  "BulletList": {
    indent: ch(1.5),
    bullets: "⦿◦+‣",
  },
  "simpleTreeExpansionLabel": {
    color: zcolor.blue,
  },
};
