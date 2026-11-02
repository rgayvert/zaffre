import { zspace, zborder, ch, pct } from "zaffre";

export const hoverTransitionRules = {
  "HStack": {
    alignItems: "center",
  },
  "ListBox": {
    padding: zspace.s2,
  },
  "Ensemble>CenterBox": {
    width: pct(100),
    height: pct(100),
  },
  "Ensemble": {
    border: zborder.thin,
    width: ch(15),
    height: ch(15),
  },
};
