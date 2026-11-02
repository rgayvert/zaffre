import { ch, em, zborder } from "zaffre";

export const toolbarExampleRules = {
  "container": {
    border: zborder.thin,
    width: ch(40),
    height: em(6),
    minWidth: ch(4),
    minHeight: em(3),
    resize: "both",
  },
  "Toolbar": {
    justifyContent: "end",
  },
  "Button": {
    border: zborder.none,
  },
};
