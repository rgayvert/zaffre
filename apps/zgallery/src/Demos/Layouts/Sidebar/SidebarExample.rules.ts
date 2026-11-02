import { px, zborder, zspace } from "zaffre";

export const sidebarExampleRules = {
  "container": {
    border: zborder.thin,
    width: px(300),
    resize: "both"
  },
  "Sidebar": {
    gap: zspace.s6,
    padding: zspace.s3,
  },
  "TextBox": {
    overflow: "hidden",
    resize: "none"
  },
};
