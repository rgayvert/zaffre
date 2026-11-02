import { px, zborder, zcolor, zrounding, zspace } from "zaffre";

export const containerExampleRules = {
  "container-top": {
    border: zborder.thin,
    gap: zspace.s6,
    padding: zspace.s4,
  },
  "Container": {
    minWidth: px(100)
  },
  "button": {
    rounding: zrounding.pill,
  },
  "button-stack": {
    gap: zspace.s5,
  },
  "box1": {
    width: px(60), 
    height: px(60),
    background: zcolor.blue,
  },
  "box2": {
    width: px(60),
    height: px(60),
    background: zcolor.red,
  },
};
